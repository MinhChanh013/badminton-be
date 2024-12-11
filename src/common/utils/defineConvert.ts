import { DataTypes } from "sequelize";
import { z } from "zod";

export const zodToSequelizeAttributes = (
  schema: z.ZodObject<any>
): Record<string, any> => {
  const shape = schema.shape;
  const attributes: Record<string, any> = {};

  for (const key of Object.keys(shape)) {
    const zodType = shape[key];
    const columnName = camelToSnakeCase(key); // Tự động chuyển sang snake_case

    // Map Zod types sang Sequelize DataTypes
    if (zodType instanceof z.ZodString) {
      attributes[key] = { type: DataTypes.STRING, field: columnName };
    } else if (zodType instanceof z.ZodNumber) {
      attributes[key] = { type: DataTypes.INTEGER, field: columnName };
    } else if (zodType instanceof z.ZodDate) {
      attributes[key] = { type: DataTypes.DATE, field: columnName };
    } else if (zodType instanceof z.ZodBoolean) {
      attributes[key] = { type: DataTypes.BOOLEAN, field: columnName };
    } else {
      throw new Error(`Unsupported Zod type for key: ${key}`);
    }
  }

  return attributes;
};

function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}
