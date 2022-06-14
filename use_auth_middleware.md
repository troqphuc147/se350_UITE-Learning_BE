# Hướng dẫn sử dụng auth middleware

Để phân quyền cho api ở backend.

* Thêm auth middleware vào file
* Gọi middleware cần dùng.
* Có 2 auth middleware:
  * onlyUser: chỉ cho phép các request từ người dùng (bao gồm "user" và "admin".
  * onlyAdmin: chỉ cho phép các request từ những người dùng có role "admin".
* Thêm middleware vào route

```javascript
const authMiddleware = require('../middleware/auth')

router.get("/current-user", authMiddleware.onlyUser, userController.getCurrentUser);
```
