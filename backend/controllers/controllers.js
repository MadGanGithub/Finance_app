import jwt from "jsonwebtoken";
import { comparePassword, hashed } from "../utils/authUtils.js";
import User from "../models/user.js";
import Transaction from "../models/transaction.js";
import { Op } from "sequelize";

//Signup
const signUp = async (req, res) => {
  try {
    const hashedPassword = await hashed(req.body.password, 10);
    const user_details = await User.create({
      name: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    res.json({ status: "ok", message: "Signed up successfully" });
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
  }
};

//Signin
const signIn = async (req, res) => {
  try {
    const found = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!found.dataValues) {
      return res.status(200).send({
        success: false,
        message: "Invalid email",
        logged: false,
      });
    }

    //post password
    const pass = req.body.password;

    //saved password
    const match = await comparePassword(pass, found.dataValues.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
        logged: false,
      });
    }

    //Token creation
    const token = jwt.sign(
      {
        email: found.dataValues.email,
        password: found.dataValues.password,
      },
      process.env.JWT_SECRET
    );

    //Sends cookie
    res.cookie("jwt", token, {
      path: "/",
      expires: new Date(Date.now() + 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).send({
      status: true,
      message: "Loggedin successfully",
      logged: true,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

//Logout
const logOut = async (req, res, next) => {
  res.clearCookie("jwt");

  res.status(200).send({
    success: true,
    message: "Logged-out",
  });
};

//Logged status check
const logCheck = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.json(false);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const found = await User.findOne({
      where: {
        email: decoded.email,
      },
    });

    if (!found.dataValues) {
      return res.send(false);
    }
    res.send(true);
  } catch (err) {
    res.json(false);
  }
};

//Add Transaction
const addTransaction = async (req, res) => {
  try {
    const jwtToken = req.cookies.jwt;
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

    const newUser = await User.findOne({
      where: { email: decoded.email },
    });

    const newTransaction = await Transaction.create({
      user_id: newUser.dataValues.user_id,
      description: req.body.description,
      amount: parseFloat(req.body.amount),
      type: req.body.type,
    });

    res.status(200).send({
      status: true,
      message: "Transaction created",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

//Get All Transactions
const getTransactions = async (req, res) => {
  try {
    const jwtToken = req.cookies.jwt;
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

    const newUser = await User.findOne({
      where: { email: decoded.email },
    });

    const newTransaction = await Transaction.findAll({
      where: { user_id: newUser.dataValues.user_id },
    });

    var arr = [];
    for (const x of newTransaction) {
      arr.push(x.dataValues);
    }

    res.status(200).send({
      status: true,
      message: "Transactions retrieved",
      transaction: arr,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

//Delete Transaction
const deleteTransaction = async (req, res) => {
  try {
    const id = req.params.id;

    const deleteTransaction = await Transaction.destroy({
      where: {
        transaction_id: id,
      },
    });

    res.status(200).send({
      status: true,
      message: "Transaction deleted",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

//Filter transactions under a range of dates
const filterTransactions = async (req, res) => {
  try {
    const start = req.body.start + "T00:00:00.000Z";
    const end = req.body.end + "T00:00:00.000Z";

    const jwtToken = req.cookies.jwt;
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

    const newUser = await User.findOne({
      where: { email: decoded.email },
    });

    const newTransaction = await Transaction.findAll({
      where: { user_id: newUser.dataValues.user_id },
    });

    const transactions = await Transaction.findAll({
      where: {
        user_id: newUser.dataValues.user_id,
        date: {
          [Op.gte]: start,
          [Op.lte]: end,
        },
      },
    });

    res.status(200).send({
      status: true,
      message: "Filtered transactions retrieved",
      transaction: transactions || [],
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

//Filter transaction for a particular date
const filterEachTransactions = async (req, res) => {
  try {
    const period = req.body.date + "T00:00:00.000Z";

    const jwtToken = req.cookies.jwt;
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

    const newUser = await User.findOne({
      where: { email: decoded.email },
    });

    const transactions = await Transaction.findAll({
      where: {
        user_id: newUser.dataValues.user_id,
        date: period,
      },
    });

    res.status(200).send({
      status: true,
      message: "Retrieved filtered transactions",
      transaction: transactions || [],
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

//Get Summary
const getSummary = async (req, res) => {
  try {
    const jwtToken = req.cookies.jwt;
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

    const newUser = await User.findOne({
      where: { email: decoded.email },
    });

    const newTransaction = await Transaction.findAll({
      where: { user_id: newUser.dataValues.user_id },
    });
    var income = 0.0;
    var expense = 0.0;

    for (const x of newTransaction) {
      if (x.type === "credit") {
        income += parseFloat(x.amount);
      } else {
        expense += parseFloat(x.amount);
      }
    }
    var savings = parseFloat(income) - parseFloat(expense);
    var spending_rate = expense / income;

    const data = {
      savings: parseFloat(savings),
      income: parseFloat(income),
      expense: parseFloat(expense),
      spending: spending_rate,
    };

    res.status(200).send({
      status: true,
      message: "Retrieved Summary",
      data: data,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

export {
  signUp,
  signIn,
  logOut,
  logCheck,
  addTransaction,
  deleteTransaction,
  getTransactions,
  filterTransactions,
  getSummary,
  filterEachTransactions,
};
