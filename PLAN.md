# Enabling AWS SSO for Personal Account

To use the `sso` command with your personal AWS account, you need to enable **IAM Identity Center** (formerly AWS SSO).

## 1. Enable IAM Identity Center

1. Log into your **Personal AWS Console** (root or admin user).
2. Search for **IAM Identity Center**. (Use a different AWS account with no resources in it, should be just used for this)
3. Click **Enable** (Enable with AWS Organizations is fine if prompted; typically "Enable" is the default for a standalone account).

## 2. Create User & Permission Set

1. **Users:** Go to **Users** -> **Add user**.
    - Username: `jeremy.spofford` (or your preference).
    - Email: Your email address.
    - Follow prompts to create the user. You will receive an invitation email to set your password.
2. **Permission Sets:** Go to **Permission sets** -> **Create permission set**.
    - Select **Predefined permission set**.
    - Choose **AdministratorAccess** (since it's your personal account).
    - Click **Create**.

## 3. Assign User to Account

1. Go to **AWS Accounts** in the sidebar.
2. Select your personal account checkbox.
3. Click **Assign users or groups**.
4. Select the **User** you created.
5. Click **Next**, then select the **Permission Set** you created (`AdministratorAccess`).
6. Click **Submit**.

## 4. Get Start URL

On the IAM Identity Center **Dashboard**, look for the **AWS access portal URL** on the right side.
It will look like: `https://d-xxxxxxxxxx.awsapps.com/start`

## 5. Update Local Config

Add the following to your `~/.aws/config` file:

```ini
# ================================
# Personal Account SSO Session
# ================================
[sso-session personal]
sso_start_url = https://<YOUR_APP_ID>.awsapps.com/start  <-- REPLACE THIS
sso_region = us-east-1
sso_registration_scopes = sso:account:access

[profile personal]
sso_session = personal
sso_account_id = <YOUR_AWS_ACCOUNT_ID>             <-- REPLACE THIS
sso_role_name = AdministratorAccess           <-- MUST MATCH PERMISSION SET NAME
region = us-east-1
output = json
```

## 6. Run

Now you can run:

```bash
sso personal
```

or just `sso` and select `personal` from the list.
