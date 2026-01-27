/**
 * Storage Adapter System
 * Abstract storage interface supporting local filesystem, S3, and Vercel Blob
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Base Storage Adapter
 * All adapters must implement these methods
 */
class StorageAdapter {
  async upload(relativePath, buffer, metadata = {}) {
    throw new Error('upload() must be implemented by subclass');
  }

  async download(relativePath) {
    throw new Error('download() must be implemented by subclass');
  }

  async delete(relativePath) {
    throw new Error('delete() must be implemented by subclass');
  }

  async exists(relativePath) {
    throw new Error('exists() must be implemented by subclass');
  }

  async list(prefix) {
    throw new Error('list() must be implemented by subclass');
  }

  async getUrl(relativePath) {
    throw new Error('getUrl() must be implemented by subclass');
  }
}

/**
 * Local Filesystem Storage Adapter
 * For development and single-server deployments
 */
class LocalStorageAdapter extends StorageAdapter {
  constructor(baseDir = './modellab-data') {
    super();
    this.baseDir = baseDir;
    this._ensureBaseDir();
  }

  async _ensureBaseDir() {
    try {
      await fs.mkdir(this.baseDir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }

  _getFullPath(relativePath) {
    return path.join(this.baseDir, relativePath);
  }

  async upload(relativePath, buffer, metadata = {}) {
    const fullPath = this._getFullPath(relativePath);
    const dir = path.dirname(fullPath);

    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, buffer);

    return {
      path: relativePath,
      size: buffer.length,
      url: fullPath,
    };
  }

  async download(relativePath) {
    const fullPath = this._getFullPath(relativePath);
    return await fs.readFile(fullPath);
  }

  async delete(relativePath) {
    const fullPath = this._getFullPath(relativePath);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }

  async exists(relativePath) {
    const fullPath = this._getFullPath(relativePath);
    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  async list(prefix) {
    const fullPath = this._getFullPath(prefix);
    try {
      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      return entries
        .filter(entry => entry.isFile())
        .map(entry => path.join(prefix, entry.name));
    } catch {
      return [];
    }
  }

  async getUrl(relativePath) {
    return this._getFullPath(relativePath);
  }
}

/**
 * Vercel Blob Storage Adapter
 * For serverless deployments on Vercel
 */
class VercelBlobAdapter extends StorageAdapter {
  constructor() {
    super();
    // Lazy load @vercel/blob to avoid requiring it when not needed
    this._blobPromise = null;
  }

  async _getBlob() {
    if (!this._blobPromise) {
      this._blobPromise = import('@vercel/blob').then(mod => mod);
    }
    return await this._blobPromise;
  }

  async upload(relativePath, buffer, metadata = {}) {
    const { put } = await this._getBlob();

    const blob = await put(relativePath, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
    });

    return {
      path: relativePath,
      size: buffer.length,
      url: blob.url,
    };
  }

  async download(relativePath) {
    const { head } = await this._getBlob();

    const blob = await head(relativePath, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    if (!blob.url) {
      throw new Error(`Blob not found: ${relativePath}`);
    }

    const response = await fetch(blob.url);
    if (!response.ok) {
      throw new Error(`Failed to download blob: ${response.statusText}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  async delete(relativePath) {
    const { del } = await this._getBlob();

    await del(relativePath, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  }

  async exists(relativePath) {
    try {
      const { head } = await this._getBlob();
      const blob = await head(relativePath, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return !!blob.url;
    } catch {
      return false;
    }
  }

  async list(prefix) {
    const { list } = await this._getBlob();

    const { blobs } = await list({
      prefix,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return blobs.map(blob => blob.pathname);
  }

  async getUrl(relativePath) {
    const { head } = await this._getBlob();

    const blob = await head(relativePath, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return blob.url;
  }
}

/**
 * AWS S3 Storage Adapter
 * For deployments using AWS S3
 */
class S3StorageAdapter extends StorageAdapter {
  constructor() {
    super();
    // Lazy load AWS SDK to avoid requiring it when not needed
    this._s3Promise = null;
    this.bucket = process.env.AWS_S3_BUCKET;
    this.region = process.env.AWS_REGION || 'us-east-1';
  }

  async _getS3() {
    if (!this._s3Promise) {
      this._s3Promise = (async () => {
        const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand, ListObjectsV2Command } = await import('@aws-sdk/client-s3');

        return {
          client: new S3Client({ region: this.region }),
          PutObjectCommand,
          GetObjectCommand,
          DeleteObjectCommand,
          HeadObjectCommand,
          ListObjectsV2Command,
        };
      })();
    }
    return await this._s3Promise;
  }

  async upload(relativePath, buffer, metadata = {}) {
    const { client, PutObjectCommand } = await this._getS3();

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: relativePath,
      Body: buffer,
      ContentType: metadata.contentType || 'application/octet-stream',
      Metadata: metadata,
    });

    await client.send(command);

    return {
      path: relativePath,
      size: buffer.length,
      url: `https://${this.bucket}.s3.${this.region}.amazonaws.com/${relativePath}`,
    };
  }

  async download(relativePath) {
    const { client, GetObjectCommand } = await this._getS3();

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: relativePath,
    });

    const response = await client.send(command);

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  async delete(relativePath) {
    const { client, DeleteObjectCommand } = await this._getS3();

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: relativePath,
    });

    await client.send(command);
  }

  async exists(relativePath) {
    try {
      const { client, HeadObjectCommand } = await this._getS3();

      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: relativePath,
      });

      await client.send(command);
      return true;
    } catch (error) {
      if (error.name === 'NotFound') return false;
      throw error;
    }
  }

  async list(prefix) {
    const { client, ListObjectsV2Command } = await this._getS3();

    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
    });

    const response = await client.send(command);
    return (response.Contents || []).map(obj => obj.Key);
  }

  async getUrl(relativePath) {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${relativePath}`;
  }
}

/**
 * Storage Adapter Factory
 * Creates the appropriate storage adapter based on environment
 */
function getStorageAdapter() {
  const storageType = process.env.STORAGE_TYPE || 'local';

  switch (storageType.toLowerCase()) {
    case 'vercel-blob':
    case 'blob':
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw new Error('BLOB_READ_WRITE_TOKEN environment variable is required for Vercel Blob storage');
      }
      console.log('✓ Using Vercel Blob storage');
      return new VercelBlobAdapter();

    case 's3':
    case 'aws-s3':
      if (!process.env.AWS_S3_BUCKET) {
        throw new Error('AWS_S3_BUCKET environment variable is required for S3 storage');
      }
      console.log('✓ Using AWS S3 storage');
      return new S3StorageAdapter();

    case 'local':
    case 'filesystem':
    default:
      const baseDir = process.env.ARTIFACTS_DIR || './modellab-data';
      console.log(`✓ Using local filesystem storage: ${baseDir}`);
      return new LocalStorageAdapter(baseDir);
  }
}

// Export classes and factory
module.exports = {
  StorageAdapter,
  LocalStorageAdapter,
  VercelBlobAdapter,
  S3StorageAdapter,
  getStorageAdapter,
};
