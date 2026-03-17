# Data Model: Hello World Endpoint

## Entities

### HelloWorldEndpoint
- **Type**: Supabase Edge Function
- **Fields**:
  - message: string (returned)
- **Authorization**: Requires valid Supabase session/JWT

### SignupPageButton
- **Type**: UI Button
- **Placement**: Under resend verification button
- **Action**: Triggers helloWorld API call

## Relationships
- SignupPageButton calls HelloWorldEndpoint via wrapper/client API

## Validation Rules
- Only signed-in users can call endpoint
- Response must be string message
- Error must be handled and shown as alert

## State Transitions
- Button pressed → API call → Success: show message alert
- Button pressed → API call → Error: show error alert
