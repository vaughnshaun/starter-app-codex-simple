# Contract: Hello World Edge Function

## Endpoint
- **Path**: `/functions/hello-world`
- **Method**: POST
- **Authorization**: Supabase JWT/session required
- **Request Body**: {}
- **Response**:
  - 200 OK: `{ message: string }`
  - 401 Unauthorized: `{ error: string }`
  - 500 Error: `{ error: string }`

## Example
- Request: `POST /functions/hello-world` with valid session
- Response: `{ message: "Hello, world!" }`

## Notes
- Only accessible to signed-in users
- Errors are returned as `{ error: string }`
