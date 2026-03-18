# Google Cloud Authentication with Terraform

## Overview
Terraform needs credentials to authenticate with Google Cloud Platform (GCP). There are several methods to authenticate:

## Authentication Methods

### 1. **Service Account Key (Recommended for CI/CD)**
- Create a service account in GCP console
- Generate a JSON key file
- Set environment variable or pass to provider:

```hcl
provider "google" {
  project = var.project_id
  region  = var.region
  credentials = file("path/to/service-account-key.json")
}
```

Or via environment variable:
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "path/to/service-account-key.json"
terraform init
terraform plan
```

### 2. **User Account (gcloud CLI)**
Best for local development:

```powershell
# Install Google Cloud SDK (if not installed)
# https://cloud.google.com/sdk/docs/install

# Authenticate with your Google account
gcloud auth application-default login

# Set your GCP project
gcloud config set project your-gcp-project-id

# Terraform will automatically use these credentials
terraform init
terraform plan
```

### 3. **Explicit Credentials in Provider**
```hcl
provider "google" {
  project = "your-gcp-project-id"
  region  = "us-central1"
  credentials = var.gcp_credentials  # Pass as JSON string via environment
}
```


## Step-by-Step Setup Guide

### For Local Development (Recommended):

```powershell
# 1. Install gcloud CLI (if not already installed)
# Visit: https://cloud.google.com/sdk/docs/install

# 2. Initialize gcloud
gcloud init

# 3. Set your project
gcloud config set project "your-gcp-project-id"

# 4. Authenticate
gcloud auth application-default login

# 5. Run Terraform
terraform init
terraform plan
terraform apply
```

### For CI/CD Pipeline (GitHub Actions, GitLab CI, etc.):

```powershell
# 1. Create a service account in GCP Console:
# - Go to: IAM & Admin > Service Accounts > Create Service Account
# - Grant roles (e.g., Editor, Storage Admin)
# - Create and download JSON key

# 2. Store the key file securely (don't commit to git!)

# 3. Set environment variable in your CI/CD platform:
# Set GOOGLE_APPLICATION_CREDENTIALS to the path of your key file

# 4. In your CI/CD pipeline, Terraform will automatically use this credential
```


## Verify Authentication

```powershell
# Check which account is currently authenticated
gcloud auth list

# Get current project
gcloud config get-value project

# Verify Terraform can access GCP
terraform init
terraform validate
```

## Troubleshooting

**Error: "The caller does not have permission"**
- Check service account has required roles assigned in GCP Console
- Ensure credentials are correctly set

**Error: "Project not set"**
- Set project in provider block or environment:
```powershell
gcloud config set project "your-gcp-project-id"
```

**Error: "Invalid credentials"**
- Verify `GOOGLE_APPLICATION_CREDENTIALS` path exists
- Re-run `gcloud auth application-default login`
- Check service account key has not expired

## Configuration in This Project

Update `terraform.tfvars` with your GCP project ID:
```hcl
project_id = "your-actual-gcp-project-id"
region     = "us-central1"
```

The provider is configured to automatically use available credentials in this order:
1. Service account key (if `credentials` argument is added)
2. `GOOGLE_APPLICATION_CREDENTIALS` environment variable
3. gcloud CLI credentials (from `gcloud auth application-default login`)
