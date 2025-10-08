#!/bin/bash
# Script to migrate data to MongoDB Atlas for production

echo "Migration script for MongoDB Atlas"
echo "=================================="
echo ""
echo "1. Create a MongoDB Atlas account at https://cloud.mongodb.com/"
echo "2. Create a new cluster"
echo "3. Get your connection string"
echo "4. Update MONGO_URL in your Vercel environment variables"
echo "5. Run the populate script in production:"
echo "   node scripts/populate_nodejs.js"
echo ""
echo "Example connection string:"
echo "mongodb+srv://username:password@cluster.mongodb.net/techhub_upe_prod"
