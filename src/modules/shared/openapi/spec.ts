export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "TrustAnchor API",
    version: "0.1.0",
    description: "API for issuing tamper-evident digital certificates and verifying them instantly."
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server"
    }
  ],
  components: {
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: {
                type: "string",
                description: "Stable machine-readable error code",
                example: "VALIDATION_ERROR"
              },
              message: {
                type: "string",
                description: "Human-readable error summary",
                example: "One or more fields are invalid"
              },
              details: {
                type: ["array", "null"],
                description: "Optional field-level validation details",
                items: {
                  type: "object"
                },
                example: [{ field: "username", message: "Required" }]
              },
              traceId: {
                type: "string",
                description: "Request trace identifier",
                example: "d2c84f39-8c74-4ad9-8d0d-93ee4374d16b"
              }
            },
            required: ["code", "message", "traceId"]
          }
        },
        required: ["error"]
      },
      LoginRequest: {
        type: "object",
        properties: {
          username: {
            type: "string",
            description: "Bootstrap admin username",
            example: "admin"
          },
          password: {
            type: "string",
            description: "Bootstrap admin password",
            example: "change-this-password"
          }
        },
        required: ["username", "password"]
      },
      CreateTemplateRequest: {
        type: "object",
        properties: {
          templateName: {
            type: "string",
            description: "Human-readable template name",
            example: "Certificate of Completion 2026"
          },
          certificateType: {
            type: "string",
            description: "Business classification for the template",
            example: "completion"
          },
          schemaVersion: {
            type: "string",
            description: "Template schema version",
            example: "1.0.0"
          },
          layoutDefinition: {
            type: "object",
            description: "Serializable layout metadata for future rendering",
            example: {
              orientation: "landscape",
              sealPosition: "right"
            }
          }
        },
        required: ["templateName", "certificateType", "schemaVersion", "layoutDefinition"]
      },
      CreateIssuanceRequest: {
        type: "object",
        properties: {
          templateId: {
            type: "string",
            description: "Identifier of the template used for issuance",
            example: "tpl_01hzk0n0m9r8e7d6c5b4a3"
          },
          recipientName: {
            type: "string",
            description: "Recipient full name shown on the certificate",
            example: "Siti Rahmawati"
          },
          recipientIdentifier: {
            type: "string",
            description: "Institution-facing recipient identifier",
            example: "NIM-2026-001"
          },
          certificateNumber: {
            type: "string",
            description: "Unique certificate number",
            example: "TA-2026-0001"
          },
          issuedAt: {
            type: "string",
            format: "date-time",
            description: "Issue timestamp in ISO 8601 format",
            example: "2026-04-21T12:00:00.000Z"
          }
        },
        required: ["templateId", "recipientName", "recipientIdentifier", "certificateNumber", "issuedAt"]
      }
    },
    securitySchemes: {
      sessionCookie: {
        type: "apiKey",
        in: "cookie",
        name: "trustanchor_session"
      }
    }
  },
  paths: {
    "/api/health": {
      get: {
        summary: "Get service health",
        description: "Checks that the application is live and that PostgreSQL is reachable.",
        responses: {
          "200": {
            description: "Service is healthy"
          },
          "500": {
            description: "Dependency is degraded",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/openapi.json": {
      get: {
        summary: "Get OpenAPI contract",
        description: "Returns the current OpenAPI 3.1 document.",
        responses: {
          "200": {
            description: "OpenAPI document returned"
          }
        }
      }
    },
    "/api/auth/login": {
      post: {
        summary: "Create bootstrap admin session",
        description: "Validates bootstrap credentials and creates an HTTP-only session cookie.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Session created"
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/certificate-templates": {
      post: {
        summary: "Create certificate template",
        description: "Creates a template for the active institution.",
        security: [{ sessionCookie: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTemplateRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Template created"
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "401": {
            description: "Missing session",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "403": {
            description: "Insufficient permissions",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/certificate-issuances": {
      post: {
        summary: "Issue certificate",
        description: "Creates a new issuance record and generates tamper-evident proof material.",
        security: [{ sessionCookie: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateIssuanceRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Issuance created"
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "404": {
            description: "Template not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "409": {
            description: "Duplicate certificate number",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/verifications/{verificationCode}": {
      get: {
        summary: "Verify certificate",
        description: "Returns public verification status and proof metadata for a certificate.",
        parameters: [
          {
            name: "verificationCode",
            in: "path",
            required: true,
            schema: {
              type: "string"
            },
            description: "Public verification code printed on the certificate",
            example: "TA-0F5N9A7K2Q"
          }
        ],
        responses: {
          "200": {
            description: "Verification result"
          },
          "404": {
            description: "Verification code not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    }
  }
} as const;
