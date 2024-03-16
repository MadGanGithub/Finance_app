import { Sequelize } from "sequelize";
import { v4 as uuidv4 } from 'uuid';

const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/postgres');

const Transaction = sequelize.define('Transaction', {
    transaction_id:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true,
        defaultValue: () => uuidv4()
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    type: {
        type: Sequelize.ENUM('debit', 'credit'),
        allowNull: false,
    },
    description:{
      type:Sequelize.STRING,
      allowNull:false,
    },
    user_id:{
      type:Sequelize.STRING,
      allowNull:false,
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_DATE')
  }  
  },{
    tableName: 'transaction'
  });
  
sequelize.sync();
  
  
export default Transaction;