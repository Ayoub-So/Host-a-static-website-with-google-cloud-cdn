# Static Website Deployment Guide

## Project Structure
```
Host_static_web_google_cdn/
├── terraform.tf              # Infrastructure as Code
├── terraform.tfvars          # Configuration variables
├── AUTHENTICATION.md         # Auth setup guide
├── DEPLOYMENT.md            # This file
├── index.html               # Homepage
├── about.html               # About page
├── contact.html             # Contact page
├── styles.css               # Global styles
└── script.js                # JavaScript functionality
```

## Prerequisites

1. **Google Cloud Project**
   - Create a project at https://console.cloud.google.com
   - Note your Project ID

2. **Terraform**
   - Install Terraform: https://www.terraform.io/downloads
   - Verify: `terraform --version`

3. **Google Cloud SDK**
   - Install: https://cloud.google.com/sdk/docs/install
   - Initialize: `gcloud init`

4. **Authentication**
   - Run: `gcloud auth application-default login`
   - This allows Terraform to access your GCP resources

## Step 1: Configure Variables

Edit `terraform.tfvars` with your GCP project ID:

```hcl
project_id = "your-gcp-project-id"  # Replace with your actual project ID
region     = "us-central1"
```

## Step 2: Initialize Terraform

```powershell
cd C:\PATH\TO\YOUR\PROJECT\FOLDER\Host_static_web_google_cdn
terraform init
```

This command:
- Downloads the Google Cloud provider
- Creates a `.terraform` directory
- Initializes your working directory

## Step 3: Plan Infrastructure

```powershell
terraform plan
```

This shows what resources will be created:
- Cloud Storage bucket
- Random ID for bucket naming

## Step 4: Deploy Infrastructure

```powershell
terraform apply
```

When prompted, type `yes` to confirm and create the resources.

**Output:** Note the bucket name displayed (you'll need it for uploads)

## Step 5: Upload Website Files

### Option A: Using gsutil (Google Cloud SDK)

```powershell
# Set your bucket name
$BUCKET_NAME = "your-bucket-name-from-terraform-output"

# Upload HTML files
gsutil -m cp *.html gs://$BUCKET_NAME/

# Upload CSS file
gsutil cp styles.css gs://$BUCKET_NAME/

# Upload JavaScript file
gsutil cp script.js gs://$BUCKET_NAME/

# Make files publicly readable (if bucket is public)
gsutil -m acl ch -u AllUsers:R gs://$BUCKET_NAME/*
```

### Option B: Using GCP Console

1. Go to https://console.cloud.google.com/storage/buckets
2. Click your bucket name
3. Click "Upload Files"
4. Select all `.html`, `.css`, and `.js` files
5. Click "Open"

## Step 6: Configure Static Website Hosting

### Using GCP Console:

1. Open Cloud Storage bucket
2. Go to "Configuration" tab
3. Enable "Configure website"
4. Set index page: `index.html`
5. Set error page: `contact.html` (or any 404 page)

### Using gsutil:

```powershell
gsutil web set -m index.html -e contact.html gs://$BUCKET_NAME
```

## Step 7: Set Permissions

### Make bucket public:

```powershell
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
```

### Or use Terraform (add to terraform.tf):

```hcl
resource "google_storage_bucket_iam_member" "public_access" {
  bucket = google_storage_bucket.static.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}
```

## Step 8: Enable Cloud CDN (Optional but Recommended)

### Create Load Balancer with CDN:

Add to `terraform.tf`:

```hcl
# Backend bucket for CDN
resource "google_compute_backend_bucket" "static_backend" {
  name            = "static-backend"
  bucket_name     = google_storage_bucket.static.name
  enable_cdn      = true
  cdn_policy {
    cached_modes = ["CACHE_MODE_CACHE_ALL"]
    client_ttl   = 3600
  }
}
```

This enables:
- Global content delivery
- Automatic caching
- Reduced bandwidth costs

## Step 9: Access Your Website

### Direct bucket URL:
```
https://storage.googleapis.com/BUCKET_NAME/index.html
```

### With Load Balancer (after setup):
```
https://your-domain.com/
```

### With Cloud CDN:
```
https://cdn-url/index.html
```

## File Updates

To update files after initial deployment:

```powershell
# Update a single file
gsutil cp index.html gs://$BUCKET_NAME/

# Update all HTML files
gsutil -m cp *.html gs://$BUCKET_NAME/

# Delete and re-upload (for major updates)
gsutil -m rm gs://$BUCKET_NAME/*
gsutil -m cp *.html gs://$BUCKET_NAME/
gsutil cp *.{css,js} gs://$BUCKET_NAME/
```

## Monitor Usage

```powershell
# Check bucket size
gsutil du -sh gs://$BUCKET_NAME

# List all files
gsutil ls -lh gs://$BUCKET_NAME

# Get bucket statistics
gcloud storage buckets describe gs://$BUCKET_NAME
```

## Cleanup (Delete Resources)

To remove all infrastructure and costs:

```powershell
# Delete Terraform resources
terraform destroy

# Confirm by typing: yes
```

This removes:
- Cloud Storage bucket
- All associated resources
- No ongoing costs

## Troubleshooting

### Issue: Bucket already exists
**Solution:** Change `byte_length` in `terraform.tf` or use unique bucket name

### Issue: Access Denied when uploading
**Solution:** 
```powershell
gcloud auth login
gcloud auth application-default login
```

### Issue: Files not accessible
**Solution:** 
```powershell
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME
```

### Issue: CORS errors
**Add to terraform.tf:**
```hcl
resource "google_storage_bucket_cors" "static_cors" {
  bucket = google_storage_bucket.static.name
  cors_rules {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    allowed_origins  = ["*"]
    allowed_headers  = ["*"]
    max_age_seconds  = 3600
  }
}
```

## Performance Optimization

### 1. Enable Gzip Compression

```hcl
# Add to terraform.tf
metadata = {
  "Cache-Control" = "public, max-age=3600"
}
```

### 2. Set Appropriate Cache Headers

```powershell
# Update metadata during upload
gsutil -h "Cache-Control: public, max-age=3600" cp index.html gs://$BUCKET_NAME/
```

### 3. Monitor CDN Performance

In GCP Console:
- Go to Cloud CDN
- View cache hit ratio
- Monitor bandwidth savings

## Cost Estimation

Typical costs for a small static website:
- **Storage:** $0.020/GB month
- **Network egress:** $0.12/GB (varies by region)
- **CDN:** $0.085/GB

Example: 1GB site with 100GB monthly traffic
- Storage: $0.02
- Network: $12
- **Total:** ~$12/month

## Next Steps

1. ✅ Set up Terraform
2. ✅ Create infrastructure
3. ✅ Upload website files
4. ✅ Configure static hosting
5. ✅ Set permissions
6. Add custom domain (Google Domains or external provider)
7. Configure SSL certificate (automatic with Load Balancer)
8. Set up monitoring and alerts
9. Implement CI/CD for automated deployments

## Resources

- [Cloud Storage Documentation](https://cloud.google.com/storage/docs)
- [Cloud CDN Documentation](https://cloud.google.com/cdn/docs)
- [Terraform Google Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [gsutil Command Reference](https://cloud.google.com/storage/docs/gsutil)

## Support

For issues or questions:
1. Check this guide for common solutions
2. Review GCP console for detailed error messages
3. Check Terraform plan output
4. Review Google Cloud documentation
