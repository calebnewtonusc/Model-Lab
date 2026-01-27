# DNS Configuration for modellab.studio

## Status

✅ **Deployment Complete**: ModelLab is deployed to Vercel
✅ **Domain Added**: modellab.studio and www.modellab.studio configured on Vercel
⏳ **Pending**: DNS records need to be configured on GoDaddy

## Live URLs (Once DNS is configured)

- **Production**: https://modellab.studio
- **WWW**: https://www.modellab.studio
- **Temporary Vercel URL**: https://modellab-eight.vercel.app

## GoDaddy DNS Configuration

To complete the setup, you need to add the following DNS records in your GoDaddy account:

### Step-by-Step Instructions

1. **Login to GoDaddy**
   - Go to https://www.godaddy.com
   - Login with your account

2. **Navigate to DNS Management**
   - Go to "My Products"
   - Find "modellab.studio"
   - Click "DNS" or "Manage DNS"

3. **Add A Records**

   Add the following two A records:

   **Record 1 - Root Domain:**
   - **Type**: A
   - **Name**: @
   - **Value**: 76.76.21.21
   - **TTL**: 600 (or default)

   **Record 2 - WWW Subdomain:**
   - **Type**: A
   - **Name**: www
   - **Value**: 76.76.21.21
   - **TTL**: 600 (or default)

4. **Save Changes**
   - Click "Save" or "Save All Changes"

## Verification

After adding the DNS records:

1. **Propagation Time**: DNS changes can take up to 48 hours to propagate globally, but typically complete within 15-30 minutes

2. **Check Status**: You can check DNS propagation at:
   - https://dnschecker.org
   - Enter "modellab.studio" and check for A records pointing to 76.76.21.21

3. **Vercel Verification**: Vercel will automatically verify your domain configuration and send you an email when complete

4. **Test the Site**: Once DNS propagates, visit:
   - https://modellab.studio
   - https://www.modellab.studio

## Current Configuration Summary

| Component | Status | Details |
|-----------|--------|---------|
| **GitHub Repo** | ✅ Connected | Auto-deploys on push to main |
| **Vercel Deployment** | ✅ Live | https://modellab-eight.vercel.app |
| **Custom Domain** | ⏳ Pending DNS | modellab.studio (awaiting GoDaddy config) |
| **WWW Domain** | ⏳ Pending DNS | www.modellab.studio (awaiting GoDaddy config) |
| **SSL Certificate** | ✅ Auto | Vercel provides automatic SSL |

## What Happens Next

1. After you configure DNS on GoDaddy, Vercel will automatically detect the changes
2. SSL certificates will be automatically provisioned (usually within 5-10 minutes)
3. Your site will be live at https://modellab.studio
4. Any future git pushes to main will automatically deploy to production

## Troubleshooting

### DNS Not Propagating
- Wait 30-60 minutes and check again
- Clear your browser cache
- Try visiting in incognito/private mode
- Use https://dnschecker.org to see global propagation status

### Domain Shows "Domain Not Found"
- Verify the A records are added correctly (76.76.21.21)
- Check that the record type is "A" (not CNAME)
- Ensure "@" is used for the root domain

### Site Shows 404 Error
- Check that the Vercel deployment is successful
- Visit the temporary URL: https://modellab-eight.vercel.app
- If temporary URL works, the issue is DNS-related

## Support

- **Vercel Documentation**: https://vercel.com/docs/concepts/projects/domains
- **GoDaddy DNS Help**: https://www.godaddy.com/help/manage-dns-records-680
- **DNS Checker**: https://dnschecker.org

---

**Next Step**: Configure the DNS records on GoDaddy as described above.
