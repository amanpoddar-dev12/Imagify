// routes/admin.js
import { protect, authorizeRoles } from "../middleware/auth.js";

router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin", "superadmin"),
  async (req, res) => {
    res.json({ message: "Welcome to Admin Panel" });
  }
);
