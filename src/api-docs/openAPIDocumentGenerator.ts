import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";

import { playerRegistry } from "@/api/payler/playerRouter";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([playerRegistry]);
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
  document.security = [
    {
      BearerAuth: [],
    },
  ];

  return document;
}
