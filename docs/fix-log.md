# System Stability Fix Log

| ID | Application | Error / Issue | Root Cause | Fix Applied | Impact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 001 | API Gateway | Network Error / CORS | Allowed Origins restricted to port 3000. | Added `http://localhost:3001` to `CorsConfig.java`. | High |
| 002 | Frontend | Broken Imports | Moved `sections` folder without updating paths. | Updated imports in `App.tsx` and related files. | High |
| 003 | Order Service | Compilation Failure | Missing imports in `OrderRepository`. | Added `BigDecimal`, `LocalDateTime` imports. | Critical |
| 004 | Frontend | Build Failure | Relative imports broken after folder move. | Correction of `../../` paths in `sections/*.tsx`. | High |
| 005 | Frontend | Registration Failure | `SignUp.tsx` was a mock component; no API call. | Implemented API call to `authService.register`. | Critical |
| 006 | Auth Service | Registration Failure (CORS) | `WebSecurityConfig` restricted origins to port 3000. | Added `http://localhost:3001` to `WebSecurityConfig`. | High |
| 007 | Frontend | Runtime Error | `products.map` is not a function in `Shop.tsx`. | Added `Array.isArray()` safety check in `useEffect`. | Critical |
| 008 | Frontend | Runtime Error (GSAP) | `undefined` refs in `Shop.tsx` causing crash. | Added null checks for `ref` and `horizontalRef`. | Critical |
| 009 | Auth Service | 500 Registration Error | Service process crashed (Exit Code 1) due to startup failure. | Restarted `auth-service` and verified logs. | Critical |
| 010 | Auth Service | Crash Loop | `mvn spring-boot:run` unstable in this environment. | Built standalone JAR (`mvn package`) and executed with `java -jar`. Stable. | Critical |
| 011 | Auth Service | Startup Crash (Validation) | `receptionist@dkarito.com` (24 chars) exceeded `User.username` max length (20). | Increased `User.username` `@Size(max)` to 50. Service now starts correctly. | Critical |
| 012 | Backend | Network Error (Refused) | All services were stopped during previous build cleanup. | Restarted `api-gateway` and all microservices. Connectivity restored. | High |
| 013 | Frontend | CORS Error (Duplicate Header) | Both `api-gateway` and `auth-service` were adding `Access-Control-Allow-Origin`. | Disabled CORS configuration in `auth-service` to defer to Gateway. | Critical |
| 014 | Frontend | Runtime Crash Loop | `LocomotiveScrollFix` aggressively calling `scroll.update()` on unstable DOM. | Disabled `scroll.update()` in fix component. UI is stable. | Critical |
| 015 | Auth Service | 400 Bad Request (Reg) | "Email already in use" validation failure returned generic 400. | Validated behavior is correct. Increased username size in Entity to 50 prevents 500s. | High |
