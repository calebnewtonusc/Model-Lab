#!/bin/bash
# ModelLab Backup & Restore Script

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
BACKUP_DIR="$PROJECT_ROOT/backups"

cd "$PROJECT_ROOT"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Show usage
show_usage() {
    echo ""
    echo "Usage: ./scripts/backup_restore.sh [command] [options]"
    echo ""
    echo "Commands:"
    echo "  backup                Create a new backup"
    echo "  restore [timestamp]   Restore from a backup"
    echo "  list                  List all available backups"
    echo "  clean [days]          Remove backups older than N days (default: 30)"
    echo ""
    echo "Examples:"
    echo "  ./scripts/backup_restore.sh backup"
    echo "  ./scripts/backup_restore.sh restore 20260127_143022"
    echo "  ./scripts/backup_restore.sh list"
    echo "  ./scripts/backup_restore.sh clean 7"
    echo ""
}

# Backup function
backup() {
    echo "======================================================================"
    echo "Creating ModelLab Backup"
    echo "======================================================================"

    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_NAME="modellab_backup_$TIMESTAMP"
    BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

    mkdir -p "$BACKUP_PATH"

    echo ""
    echo "Backup location: $BACKUP_PATH"

    # Backup database
    if [ -f "modellab.db" ]; then
        echo "Backing up database..."
        cp modellab.db "$BACKUP_PATH/"
        [ -f "modellab.db-shm" ] && cp modellab.db-shm "$BACKUP_PATH/" || true
        [ -f "modellab.db-wal" ] && cp modellab.db-wal "$BACKUP_PATH/" || true
        echo "✓ Database backed up"
    else
        echo "⚠️  No database found"
    fi

    # Backup artifacts
    if [ -d "artifacts" ] && [ "$(ls -A artifacts)" ]; then
        echo "Backing up artifacts..."
        cp -r artifacts "$BACKUP_PATH/"
        ARTIFACT_COUNT=$(find "$BACKUP_PATH/artifacts" -type f | wc -l)
        echo "✓ Backed up $ARTIFACT_COUNT artifact files"
    else
        echo "⚠️  No artifacts to backup"
    fi

    # Create metadata file
    echo "Creating backup metadata..."
    cat > "$BACKUP_PATH/backup_info.txt" << EOF
ModelLab Backup
===============
Timestamp: $TIMESTAMP
Date: $(date)
Database: $([ -f "modellab.db" ] && echo "Yes" || echo "No")
Artifacts: $([ -d "artifacts" ] && echo "$(find artifacts -type f 2>/dev/null | wc -l) files" || echo "None")
Backup Size: $(du -sh "$BACKUP_PATH" | cut -f1)
EOF

    echo "✓ Backup metadata created"

    # Create compressed archive
    echo "Compressing backup..."
    cd "$BACKUP_DIR"
    tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"
    rm -rf "$BACKUP_NAME"
    cd "$PROJECT_ROOT"

    BACKUP_SIZE=$(du -sh "$BACKUP_DIR/${BACKUP_NAME}.tar.gz" | cut -f1)

    echo ""
    echo "======================================================================"
    echo "Backup Complete!"
    echo "======================================================================"
    echo "Backup file: $BACKUP_DIR/${BACKUP_NAME}.tar.gz"
    echo "Size: $BACKUP_SIZE"
    echo ""
}

# Restore function
restore() {
    if [ -z "$1" ]; then
        echo "Error: Please specify a backup timestamp"
        echo "Use './scripts/backup_restore.sh list' to see available backups"
        exit 1
    fi

    TIMESTAMP=$1
    BACKUP_NAME="modellab_backup_$TIMESTAMP"
    BACKUP_FILE="$BACKUP_DIR/${BACKUP_NAME}.tar.gz"

    if [ ! -f "$BACKUP_FILE" ]; then
        echo "Error: Backup not found: $BACKUP_FILE"
        exit 1
    fi

    echo "======================================================================"
    echo "Restoring ModelLab Backup"
    echo "======================================================================"
    echo ""
    echo "⚠️  WARNING: This will overwrite current data!"
    echo "Backup file: $BACKUP_FILE"
    echo ""
    read -p "Are you sure you want to restore? Type 'yes' to confirm: " confirm

    if [ "$confirm" != "yes" ]; then
        echo "Restore cancelled"
        exit 0
    fi

    # Extract backup
    echo ""
    echo "Extracting backup..."
    cd "$BACKUP_DIR"
    tar -xzf "${BACKUP_NAME}.tar.gz"
    cd "$PROJECT_ROOT"

    # Restore database
    if [ -f "$BACKUP_DIR/$BACKUP_NAME/modellab.db" ]; then
        echo "Restoring database..."
        cp "$BACKUP_DIR/$BACKUP_NAME/modellab.db" .
        [ -f "$BACKUP_DIR/$BACKUP_NAME/modellab.db-shm" ] && cp "$BACKUP_DIR/$BACKUP_NAME/modellab.db-shm" . || true
        [ -f "$BACKUP_DIR/$BACKUP_NAME/modellab.db-wal" ] && cp "$BACKUP_DIR/$BACKUP_NAME/modellab.db-wal" . || true
        echo "✓ Database restored"
    fi

    # Restore artifacts
    if [ -d "$BACKUP_DIR/$BACKUP_NAME/artifacts" ]; then
        echo "Restoring artifacts..."
        rm -rf artifacts
        cp -r "$BACKUP_DIR/$BACKUP_NAME/artifacts" .
        ARTIFACT_COUNT=$(find artifacts -type f | wc -l)
        echo "✓ Restored $ARTIFACT_COUNT artifact files"
    fi

    # Clean up extracted backup
    rm -rf "$BACKUP_DIR/$BACKUP_NAME"

    echo ""
    echo "======================================================================"
    echo "Restore Complete!"
    echo "======================================================================"
    echo ""
}

# List backups
list_backups() {
    echo "======================================================================"
    echo "Available ModelLab Backups"
    echo "======================================================================"
    echo ""

    if [ ! "$(ls -A $BACKUP_DIR/*.tar.gz 2>/dev/null)" ]; then
        echo "No backups found"
        echo ""
        return
    fi

    printf "%-20s %-20s %-10s\n" "TIMESTAMP" "DATE" "SIZE"
    echo "----------------------------------------------------------------------"

    for backup in "$BACKUP_DIR"/modellab_backup_*.tar.gz; do
        if [ -f "$backup" ]; then
            filename=$(basename "$backup")
            timestamp=$(echo "$filename" | sed 's/modellab_backup_\(.*\)\.tar\.gz/\1/')

            # Convert timestamp to readable date
            year=${timestamp:0:4}
            month=${timestamp:4:2}
            day=${timestamp:6:2}
            hour=${timestamp:9:2}
            minute=${timestamp:11:2}
            second=${timestamp:13:2}
            date_str="$year-$month-$day $hour:$minute:$second"

            size=$(du -sh "$backup" | cut -f1)

            printf "%-20s %-20s %-10s\n" "$timestamp" "$date_str" "$size"
        fi
    done

    echo ""
    echo "To restore a backup, run:"
    echo "  ./scripts/backup_restore.sh restore <TIMESTAMP>"
    echo ""
}

# Clean old backups
clean_backups() {
    DAYS=${1:-30}

    echo "======================================================================"
    echo "Cleaning Old Backups (older than $DAYS days)"
    echo "======================================================================"
    echo ""

    DELETED=0
    for backup in "$BACKUP_DIR"/modellab_backup_*.tar.gz; do
        if [ -f "$backup" ]; then
            # Check if file is older than N days
            if [ "$(find "$backup" -mtime +$DAYS)" ]; then
                echo "Deleting: $(basename "$backup")"
                rm "$backup"
                DELETED=$((DELETED + 1))
            fi
        fi
    done

    if [ $DELETED -eq 0 ]; then
        echo "No backups older than $DAYS days found"
    else
        echo ""
        echo "✓ Deleted $DELETED old backup(s)"
    fi

    echo ""
}

# Main command dispatcher
case "$1" in
    backup)
        backup
        ;;
    restore)
        restore "$2"
        ;;
    list)
        list_backups
        ;;
    clean)
        clean_backups "$2"
        ;;
    *)
        show_usage
        exit 1
        ;;
esac
