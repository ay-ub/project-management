const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const generateToken = (user, res) => {
  const token = jwt.sign({ ...user.dataValues }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
const register = async (req, res) => {
  try {
    const { name, familyName, email, password } = req.body;

    if (!name || !familyName || !email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
        data: null,
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "fail", data: null, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      familyName,
      email,
      password: hashedPassword,
    });
    delete newUser.dataValues.password;
    generateToken(newUser, res);
    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        data: null,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        data: null,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "fail",
        data: null,
        message: "Invalid email or password",
      });
    }
    delete user.dataValues.password;

    generateToken(user, res);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      status: "success",
      data: null,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;

    const deleted = await User.destroy({ where: { email } });
    if (!deleted) {
      return res
        .status(404)
        .json({ status: "fail", data: null, message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: null,
      message: "User deleted successfully",
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: "error", data: null, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email } = req.params;

    const updated = await User.update(req.body, { where: { email } });
    if (!updated[0]) {
      return res
        .status(404)
        .json({ status: "fail", data: null, message: "User not found" });
    }

    res.status(200).json({
      status: "success",
      data: null,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  deleteUser,
  updateUser,
};
