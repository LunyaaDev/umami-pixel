# Umami-Pixel

A lightweight tracking pixel proxy for [Umami Analytics](https://umami.is/) - track analytics without JavaScript.

## Features

- Serves a 1x1 tracking pixel or a 204 No Content response
- Forwards tracking events to your Umami instance
- Supports UTM parameters and custom event data
- Restricts allowed website IDs (optional)
- Handles trusted proxy IPs for accurate client IP extraction

## Usage

### Running in Docker

```sh
docker run -e UMAMI_BASE_URL=http://umami:3000 -p 3001:3001 lunyaadev/umami-pixel:latest
```

## Environment variables

| Variable              | Description                                       |
| --------------------- | ------------------------------------------------- |
| `UMAMI_HOST`          | Base URL of your Umami instance                   |
| `TRUSTED_PROXY_IPS`   | Comma-separated list of allowed proxy IPs / CIDRs |
| `PROXY_IP_HEADER`     | Header name to extract client IP from             |
| `ALLOWED_WEBSITE_IDS` | WebsiteIds allowed to proxy (all if not set)      |

## Tracking Pixel

`GET /:responseType/:websiteId/*`

- `:responseType`:
  - `pxl` (returns a 1x1 transparent PNG)
  - `req` (returns 204)
- `:websiteId`: Your Umami website UUID
- `*`: Path and query parameters (UTM, event, etc.)

### Query Parameters

| Parameter      | Description              |
| -------------- | ------------------------ |
| `utm_source`   | UTM campaign source      |
| `utm_medium`   | UTM campaign medium      |
| `utm_campaign` | UTM campaign name        |
| `utm_content`  | UTM content              |
| `utm_term`     | UTM term / keyword       |
| `event`        | Custom event name        |
| `title`        | Page or event title      |
| `tag`          | Custom tag for the event |

Any other parameters will be passed through to Umami as custom data fields.

## Use Tracking Pixel

### HTML

```html
<img src="<your-url>" />
```

### Markdown Files

```markdown
![tracker](your-url)
```

### CLI

Track usage of CLI tools, installation scripts, or update checks.

```sh
curl -s <your-url>
```

## Examples

- **1. Basic tracking pixel request**

  `GET /pxl/6ef5243a-6b17-11f0-b571-325096b39f47`

  - Returns a 1x1 transparent PNG.
  - Tracks a pageview for the website with ID `6ef5243a-6b17-11f0-b571-325096b39f47`.

- **2. Tracking pixel with UTM parameters**

  `GET /pxl/6ef5243a-6b17-11f0-b571-325096b39f47?utm_source=blog&utm_medium=footer&utm_campaign=release-v1`

  - Returns a 1x1 transparent PNG.
  - Tracks a pageview with UTM parameters for source, medium, and campaign.

- **3. Custom event tracking (no pixel)**

  `GET /req/6ef5243a-6b17-11f0-b571-325096b39f47?event=Signup`

  - Returns a 204 No Content response.
  - Tracks a custom event named `Signup` for the specified website.

- **4. Tracking with additional custom data**

  `GET /pxl/6ef5243a-6b17-11f0-b571-325096b39f47?event=Purchase&value=99&currency=USD`

  - Returns a 1x1 transparent PNG.
  - Tracks a `Purchase` event with extra data (`value` and `currency`).

- **5. Tracking a specific page path**

  `GET /pxl/6ef5243a-6b17-11f0-b571-325096b39f47/products/123?utm_source=ad`

  - Returns a 1x1 transparent PNG.
  - Tracks a pageview for `/products/123` with UTM source `ad`.

## License

GPL-3.0-or-later
