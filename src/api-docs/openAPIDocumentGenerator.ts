import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";

import { authRegistry } from "@/api/auth/authRouter";
import { playerRegistry } from "@/api/payler/playerRouter";
import { courtRegistry } from "@/api/court/courtRouter";
import { discountRegistry } from "@/api/discount/discountRouter";
import { expensesRegistry } from "@/api/expenses/expensesRouter";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([
    authRegistry,
    playerRegistry,
    courtRegistry,
    discountRegistry,
    expensesRegistry,
  ]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  // Tạo tài liệu cơ bản
  const document = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Swagger API",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  });

  document.components = {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  };

  return document;
}
