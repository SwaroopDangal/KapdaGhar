const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not logged in" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access only" });
    }

    next();
  } catch (error) {
    console.log("isAdmin error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error checking admin role" });
  }
};

export default isAdmin;
