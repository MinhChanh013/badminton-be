import { env } from "@/common/utils/envConfig";
import { Sequelize } from "sequelize";
const { DATABASE_URL } = env;

// Cấu hình kết nối
export const sequelize = new Sequelize(DATABASE_URL);

// Kiểm tra kết nối
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export const connectDatabase = async () => {
  try {
    await sequelize.sync();
    console.log("Database synchronized");
  } catch (error) {
    console.error("Unable to synchronize the database:", error);
  }
};
