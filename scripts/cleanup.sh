#!/bin/bash
# ModelLab Cleanup Script - Clean old artifacts and temporary files

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$PROJECT_ROOT"

echo "======================================================================"
echo "ModelLab Cleanup Script"
echo "======================================================================"

# Parse command line arguments
CLEAN_ALL=false
CLEAN_ARTIFACTS=false
CLEAN_LOGS=false
CLEAN_TEMP=false
CLEAN_DB=false

if [ "$1" == "--all" ]; then
    CLEAN_ALL=true
elif [ "$1" == "--artifacts" ]; then
    CLEAN_ARTIFACTS=true
elif [ "$1" == "--logs" ]; then
    CLEAN_LOGS=true
elif [ "$1" == "--temp" ]; then
    CLEAN_TEMP=true
elif [ "$1" == "--db" ]; then
    CLEAN_DB=true
elif [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo ""
    echo "Usage: ./scripts/cleanup.sh [option]"
    echo ""
    echo "Options:"
    echo "  --all         Clean everything (artifacts, logs, temp files, database)"
    echo "  --artifacts   Clean only artifacts directory"
    echo "  --logs        Clean only log files"
    echo "  --temp        Clean only temporary files"
    echo "  --db          Reset database (WARNING: deletes all data)"
    echo "  --help, -h    Show this help message"
    echo ""
    exit 0
else
    # Interactive mode
    echo ""
    echo "Select what to clean:"
    echo "  1) Everything (artifacts, logs, temp, database)"
    echo "  2) Artifacts only"
    echo "  3) Logs only"
    echo "  4) Temporary files only"
    echo "  5) Database only (WARNING: deletes all data)"
    echo "  6) Cancel"
    echo ""
    read -p "Enter choice [1-6]: " choice

    case $choice in
        1) CLEAN_ALL=true ;;
        2) CLEAN_ARTIFACTS=true ;;
        3) CLEAN_LOGS=true ;;
        4) CLEAN_TEMP=true ;;
        5) CLEAN_DB=true ;;
        6) echo "Cancelled."; exit 0 ;;
        *) echo "Invalid choice. Exiting."; exit 1 ;;
    esac
fi

# Clean artifacts
if [ "$CLEAN_ALL" = true ] || [ "$CLEAN_ARTIFACTS" = true ]; then
    echo ""
    echo "Cleaning artifacts directory..."
    if [ -d "artifacts" ]; then
        ARTIFACT_COUNT=$(find artifacts -type f 2>/dev/null | wc -l)
        rm -rf artifacts/*
        echo "✓ Removed $ARTIFACT_COUNT files from artifacts/"
    else
        echo "✓ No artifacts directory found"
    fi
fi

# Clean logs
if [ "$CLEAN_ALL" = true ] || [ "$CLEAN_LOGS" = true ]; then
    echo ""
    echo "Cleaning log files..."
    if [ -d "logs" ]; then
        LOG_COUNT=$(find logs -type f 2>/dev/null | wc -l)
        rm -rf logs/*
        echo "✓ Removed $LOG_COUNT log files"
    else
        echo "✓ No logs directory found"
    fi
fi

# Clean temp files
if [ "$CLEAN_ALL" = true ] || [ "$CLEAN_TEMP" = true ]; then
    echo ""
    echo "Cleaning temporary files..."
    find . -name "*.pyc" -delete 2>/dev/null || true
    find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
    find . -name ".DS_Store" -delete 2>/dev/null || true
    find . -name "*.log" -delete 2>/dev/null || true
    echo "✓ Removed temporary files"
fi

# Clean database
if [ "$CLEAN_ALL" = true ] || [ "$CLEAN_DB" = true ]; then
    echo ""
    echo "⚠️  WARNING: This will delete ALL data from the database!"
    read -p "Are you sure? Type 'yes' to confirm: " confirm

    if [ "$confirm" == "yes" ]; then
        echo "Resetting database..."
        if [ -f "modellab.db" ]; then
            rm modellab.db
            echo "✓ Database deleted"
        else
            echo "✓ No database found"
        fi

        if [ -f "modellab.db-shm" ]; then
            rm modellab.db-shm
        fi

        if [ -f "modellab.db-wal" ]; then
            rm modellab.db-wal
        fi

        # Restart server to recreate database
        echo "Initializing new database..."
        node server.js &
        SERVER_PID=$!
        sleep 3
        kill $SERVER_PID 2>/dev/null || true
        echo "✓ Database recreated"
    else
        echo "Database cleanup cancelled"
    fi
fi

echo ""
echo "======================================================================"
echo "Cleanup Complete!"
echo "======================================================================"
