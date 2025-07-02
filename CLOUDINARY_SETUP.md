# Cloudinary Setup Instructions

Follow these steps to set up Cloudinary for image uploads:

1. Go to [Cloudinary's website](https://cloudinary.com/) and sign up for a free account.

2. After signing up and logging in, navigate to your Dashboard.

3. Find your cloud name, API key, and API secret in the dashboard. You'll need the cloud name.

4. Create an unsigned upload preset:
   - Go to Settings > Upload
   - Scroll down to "Upload presets" and click "Add upload preset"
   - Set "Signing Mode" to "Unsigned"
   - Name your preset "everafter" (to match the environment variable)
   - Set the folder where you want images to be stored (optional)
   - Click "Save" at the bottom

5. Update your `.env` file with these values:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=everafter
   ```

6. Restart your development server for the changes to take effect.

## Troubleshooting Image Upload Errors

If you encounter issues with image uploads:

1. Verify that your environment variables match your Cloudinary settings:
   - Make sure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` matches your Cloudinary cloud name exactly
   - Make sure `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` matches the upload preset you created

2. Check that your upload preset:
   - Is set to "Unsigned" mode
   - Is correctly named (match it with your environment variable)
   - Has proper permissions

3. Use the debug page to test:
   - Go to `/debug` in your application
   - Check the "Cloudinary Configuration" tab
   - Try a test upload

4. Common errors:
   - "Invalid cloud name" - Your cloud name environment variable is incorrect
   - "Resource not found" - Upload preset doesn't exist or is misspelled
   - "Not authorized" - Upload preset isn't set to "Unsigned"

That's it! Your application should now be able to upload images to Cloudinary.