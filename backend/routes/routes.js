import express from 'express'
import {signUp,signIn,check,logOut,logCheck,addTransaction,getTransactions,filterTransactions,getSummary,filterEachTransactions,deleteTransaction} from '../controllers/controllers.js'

const router = express.Router()

router.route('/').get(check)
router.route('/signin').post(signIn)
router.route('/signup').post(signUp)
router.route('/logout').get(logOut)
router.route("/logcheck").get(logCheck)
router.route("/transactions").post(addTransaction)
router.route("/transactions").get(getTransactions)
router.route('/summary').get(getSummary)
router.route('/delete/:id').delete(deleteTransaction)
router.route("/transactions/range").post(filterTransactions)
router.route('/transactions/particular').post(filterEachTransactions)

export default router
