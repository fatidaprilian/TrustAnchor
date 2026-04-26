export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "TrustAnchor API",
    version: "0.1.0",
    description: "API for issuing RSA-SHA256 signed digital certificates and verifying them instantly."
  },
  servers: [
    {
      url: "https://trustanchor.example.edu",
      description: "Production server"
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
      CreateInstitutionRequest: {
        type: "object",
        properties: {
          code: {
            type: "string",
            description: "Unique institution code",
            example: "UNIV-DEMO"
          },
          name: {
            type: "string",
            description: "Institution display name",
            example: "Demo University"
          },
          adminUsername: {
            type: "string",
            description: "Initial institution operator username",
            example: "demo-operator"
          },
          adminPassword: {
            type: "string",
            description: "Initial institution operator password",
            example: "change-this-password"
          }
        },
        required: ["code", "name", "adminUsername", "adminPassword"]
      },
      UpdateInstitutionRequest: {
        type: "object",
        properties: {
          code: {
            type: "string",
            description: "Unique institution code",
            example: "UNIV-DEMO"
          },
          name: {
            type: "string",
            description: "Institution display name",
            example: "Demo University"
          }
        },
        required: ["code", "name"]
      },
      CreateInstitutionOperatorRequest: {
        type: "object",
        properties: {
          username: {
            type: "string",
            description: "Institution operator username",
            example: "operator-demo"
          },
          password: {
            type: "string",
            description: "Institution operator temporary password",
            example: "change-this-password"
          }
        },
        required: ["username", "password"]
      },
      ResetInstitutionOperatorPasswordRequest: {
        type: "object",
        properties: {
          password: {
            type: "string",
            description: "New institution operator password",
            example: "change-this-password"
          }
        },
        required: ["password"]
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
            description: "Institution-facing recipient identifier. Stored with field-level encryption and not exposed publicly.",
            example: "NIM-2026-001"
          },
          certificateNumber: {
            type: "string",
            description: "Unique certificate number",
            example: "TA-2026-0001"
          }
        },
        required: ["templateId", "recipientName", "recipientIdentifier", "certificateNumber"]
      }
    },
    securitySchemes: {
      sessionCookie: {
        type: "apiKey",
        in: "cookie",
        name: "trustanchor_session"
      },
      csrfHeader: {
        type: "apiKey",
        in: "header",
        name: "x-csrf-token"
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
        description: "Validates bootstrap platform credentials or institution operator credentials and creates an HTTP-only session cookie.",
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
    "/api/admin/institutions": {
      get: {
        summary: "List institutions",
        description: "Returns all institution workspaces for platform administrators.",
        security: [{ sessionCookie: [] }],
        responses: {
          "200": {
            description: "Institution list returned"
          },
          "403": {
            description: "Platform administrator role required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      post: {
        summary: "Create institution",
        description: "Creates an institution workspace for platform administrators.",
        security: [{ csrfHeader: [], sessionCookie: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateInstitutionRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Institution created"
          },
          "403": {
            description: "Platform administrator role or valid CSRF token required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "409": {
            description: "Institution code already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "429": {
            description: "Rate limit exceeded",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/admin/institutions/{institutionId}": {
      patch: {
        summary: "Update institution",
        description: "Updates an institution workspace for platform administrators.",
        security: [{ csrfHeader: [], sessionCookie: [] }],
        parameters: [
          {
            name: "institutionId",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateInstitutionRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Institution updated"
          },
          "403": {
            description: "Platform administrator role or valid CSRF token required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "404": {
            description: "Institution not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "409": {
            description: "Institution code already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/admin/institutions/{institutionId}/operators": {
      get: {
        summary: "List institution operators",
        description: "Lists operator accounts for one institution workspace.",
        security: [{ sessionCookie: [] }],
        parameters: [
          {
            name: "institutionId",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          "200": {
            description: "Operator list returned"
          },
          "403": {
            description: "Platform administrator role required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      post: {
        summary: "Create institution operator",
        description: "Creates an additional institution operator account.",
        security: [{ csrfHeader: [], sessionCookie: [] }],
        parameters: [
          {
            name: "institutionId",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateInstitutionOperatorRequest" }
            }
          }
        },
        responses: {
          "201": {
            description: "Operator created"
          },
          "403": {
            description: "Platform administrator role or valid CSRF token required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "409": {
            description: "Operator username already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/admin/institutions/{institutionId}/operators/{operatorId}/password": {
      patch: {
        summary: "Reset institution operator password",
        description: "Updates the password for one institution operator account.",
        security: [{ csrfHeader: [], sessionCookie: [] }],
        parameters: [
          {
            name: "institutionId",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          },
          {
            name: "operatorId",
            in: "path",
            required: true,
            schema: {
              type: "string"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ResetInstitutionOperatorPasswordRequest" }
            }
          }
        },
        responses: {
          "200": {
            description: "Operator password reset"
          },
          "403": {
            description: "Platform administrator role or valid CSRF token required",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "404": {
            description: "Operator not found",
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
        security: [{ csrfHeader: [], sessionCookie: [] }],
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
            description: "Insufficient permissions or invalid CSRF token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "429": {
            description: "Rate limit exceeded",
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
        description: "Creates a new issuance record and generates SHA-256, RSA-SHA256, and encrypted proof material.",
        security: [{ csrfHeader: [], sessionCookie: [] }],
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
          },
          "429": {
            description: "Rate limit exceeded",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/api/certificate-issuances/{issuanceId}/revoke": {
      post: {
        summary: "Revoke certificate issuance",
        description: "Marks an issuance as revoked while keeping the audit and proof record intact.",
        security: [{ csrfHeader: [], sessionCookie: [] }],
        parameters: [
          {
            name: "issuanceId",
            in: "path",
            required: true,
            schema: {
              type: "string"
            },
            description: "Issuance record identifier"
          }
        ],
        responses: {
          "200": {
            description: "Issuance revoked"
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
          },
          "404": {
            description: "Issuance not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "429": {
            description: "Rate limit exceeded",
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
        description: "Returns public verification status after the server validates the RSA signature and document hash.",
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
    },
    "/api/verifications/{verificationCode}/qr": {
      get: {
        summary: "Get verification QR code",
        description: "Returns an SVG QR code that points to the public verification page.",
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
            description: "SVG QR code",
            content: {
              "image/svg+xml": {
                schema: {
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    "/api/verifications/{verificationCode}/certificate-pdf": {
      get: {
        summary: "Get certificate PDF",
        description: "Renders a server-side PDF certificate, stores a copy in MinIO, and returns the PDF.",
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
            description: "PDF certificate artifact",
            content: {
              "application/pdf": {
                schema: {
                  type: "string",
                  format: "binary"
                }
              }
            }
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
