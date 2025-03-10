# @cosmo.chang1701/strapi-provider-upload-vercel-blob

## Installation

```bash
yarn add @cosmo.chang1701/strapi-provider-upload-vercel-blob
```

## Usage

### Configuration

To configure the provider, update your Strapi project's config/plugins.js file:

```js
export default ({ env }) => ({
  upload: {
    config: {
      provider: '@cosmo.chang1701/strapi-provider-upload-vercel-blob',
      providerOptions: {
        accessToken: env('BLOB_READ_WRITE_TOKEN'),
        pathname: env('BLOB_PATHNAME'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
})
```

### Environment Variables

Ensure the following values are set in your environment variables:

- `BLOB_READ_WRITE_TOKEN` - Your Vercel Blob access token.
- `BLOB_PATHNAME` - The directory for storing uploaded files in the Vercel Blob Store.

## Security Middleware Configuration

To comply with security policies, update config/middlewares.js as follows:

```js ./config/middlewares.js
module.exports = [
  // ...
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'yourVercelBlobStoreId.public.blob.vercel-storage.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'yourVercelBlobStoreId.public.blob.vercel-storage.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  // ...
]
```

## License

This project is licensed under the [MIT License](LICENSE).
