# Website Directory README

This directory contains all files needed to host a static website on Google Cloud Platform (GCP) using Infrastructure as Code with Terraform.

## 📁 Files Overview

### Configuration Files
- **`terraform.tf`** - Main infrastructure configuration for Google Cloud
- **`terraform.tfvars`** - Project-specific variables (Project ID, Region)
- **`.terraform/`** - Terraform working directory (created after `terraform init`)

### Website Files
- **`index.html`** - Homepage with features and hero section
- **`about.html`** - About page with architecture details
- **`contact.html`** - Contact form and information page
- **`styles.css`** - Global stylesheet with responsive design
- **`script.js`** - JavaScript utilities and interactivity

### Documentation
- **`AUTHENTICATION.md`** - How to authenticate with Google Cloud
- **`DEPLOYMENT.md`** - Step-by-step deployment guide
- **`README.md`** - This file

## 🚀 Quick Start

### 1. Prerequisites
```powershell
# Install gcloud SDK
# https://cloud.google.com/sdk/docs/install

# Install Terraform
# https://www.terraform.io/downloads

# Authenticate
gcloud auth application-default login
```

### 2. Configure
Edit `terraform.tfvars`:
```hcl
project_id = "your-actual-gcp-project-id"
region     = "us-central1"
```

### 3. Deploy
```powershell
cd C:\PATH\TO\YOUR\PROJECT\FOLDER
terraform init
terraform plan
terraform apply
```

### 4. Upload Files
```powershell
$BUCKET = $(terraform output -raw bucket_name)
gsutil -m cp *.html gs://$BUCKET/
gsutil cp styles.css gs://$BUCKET/
gsutil cp script.js gs://$BUCKET/
```

### 5. Access
```
https://storage.googleapis.com/your-bucket-name/index.html
```

## 📖 Documentation Files

### AUTHENTICATION.md
Complete guide to:
- Service account setup
- gcloud CLI authentication
- Environment variable configuration
- CI/CD pipeline integration
- Security best practices

### DEPLOYMENT.md
Detailed instructions for:
- Infrastructure deployment
- File uploads to Cloud Storage
- Website configuration
- CDN setup
- Access control
- Cost estimation
- Troubleshooting

## 🏗️ Architecture

```
                    User's Browser
                          ↓
                   Cloud CDN (Edge)
                          ↓
                   Cloud Load Balancer
                          ↓
                 Google Cloud Storage
                   (HTML, CSS, JS)
```

## 📊 Included Features

### Homepage (index.html)
- Hero section with gradient background
- Feature cards with icons
- Call-to-action button
- Responsive navigation
- Information about the project

### About Page (about.html)
- Project overview
- Architecture diagram
- Technology stack
- Project timeline
- Key benefits
- Getting started guide

### Contact Page (contact.html)
- Contact form with validation
- Contact information
- Interactive form handling
- Success message

### Styling (styles.css)
- Modern gradient design
- Responsive grid layouts
- Card components
- Button styles
- Form inputs
- Mobile-friendly media queries

### JavaScript (script.js)
- Navigation setup
- Smooth scrolling
- Form validation
- Theme management
- Analytics tracking
- Performance utilities

## 🔧 Common Commands

```powershell
# Initialize Terraform working directory
terraform init

# Check configuration syntax
terraform validate

# Preview changes
terraform plan

# Apply changes
terraform apply

# Destroy all resources
terraform destroy

# Show outputs
terraform output

# Show specific output
terraform output bucket_name

# Format code
terraform fmt
```

## 📋 Project Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `project_id` | - | Your GCP Project ID (required) |
| `region` | us-central1 | GCP region for resources |

## 🔐 Security Notes

✅ **Best Practices Implemented:**
- Service account authentication
- Granular IAM permissions
- No hardcoded credentials
- HTTPS/SSL ready
- CORS headers configured
- Bucket versioning support

⚠️ **Remember:**
- Keep `terraform.tfvars` out of version control
- Use service accounts for automation
- Regularly rotate credentials
- Monitor GCP billing

## 📈 Performance Features

- **Global CDN** - Content served from edge locations worldwide
- **Automatic Caching** - Reduced latency and bandwidth
- **Compression** - Gzip compression enabled
- **Cache Control** - Configurable cache expiration
- **HTTPS** - Secure connections with SSL/TLS

## 💰 Cost Estimation

For a typical small website:
- **Storage:** ~$0.02/month
- **CDN:** ~$0.50-$5/month (depends on traffic)
- **Data egress:** ~$0.12/GB

**Total:** $5-20/month for small sites

## 🆘 Troubleshooting

### Authentication Issues
```powershell
gcloud auth application-default login
gcloud config set project your-project-id
```

### Bucket Access Denied
```powershell
gcloud storage buckets update gs://bucket-name --uniform-bucket-level-access
```

### Files Not Uploading
```powershell
# Verify bucket exists
gsutil ls

# Check permissions
gsutil iam get gs://bucket-name
```

### CDN Not Working
- Wait 10-15 minutes for CDN propagation
- Check cache statistics in GCP console
- Verify bucket is public or load balancer is configured

## 📚 Resources

- [Google Cloud Storage](https://cloud.google.com/storage)
- [Cloud CDN Documentation](https://cloud.google.com/cdn)
- [Terraform Google Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [gsutil Command Reference](https://cloud.google.com/storage/docs/gsutil)
- [Google Cloud Learning Path](https://cloud.google.com/training)

## 🎯 Next Steps

1. ✅ Read AUTHENTICATION.md for setup
2. ✅ Review DEPLOYMENT.md for detailed instructions
3. Configure terraform.tfvars
4. Deploy infrastructure
5. Upload website files
6. Test website functionality
7. Configure custom domain
8. Set up monitoring

## 📞 Support

For help:
1. Check relevant .md documentation
2. Review GCP Console for error messages
3. Verify terraform plan output
4. Check file permissions
5. Review Google Cloud documentation

---

**Version:** 1.0.0  
**Last Updated:** March 18, 2026  
**License:** MIT
