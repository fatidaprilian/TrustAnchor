create table if not exists institutions (
  id text primary key,
  code text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists certificate_templates (
  id text primary key,
  institution_id text not null references institutions(id),
  template_name text not null,
  certificate_type text not null,
  schema_version text not null,
  layout_definition jsonb not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists certificate_templates_institution_created_at_idx
  on certificate_templates (institution_id, created_at desc);

create table if not exists certificate_issuances (
  id text primary key,
  institution_id text not null references institutions(id),
  template_id text not null references certificate_templates(id),
  verification_code text not null unique,
  certificate_number text not null unique,
  recipient_name text not null,
  recipient_identifier text not null,
  issued_at timestamptz not null,
  document_hash text not null,
  digital_signature text not null,
  encrypted_payload text not null,
  payload_iv text not null,
  payload_tag text not null,
  wrapped_document_key text not null,
  wrapped_key_iv text not null,
  wrapped_key_tag text not null,
  public_claims jsonb not null,
  status text not null,
  created_at timestamptz not null default now()
);

create index if not exists certificate_issuances_verification_lookup_idx
  on certificate_issuances (verification_code);

create index if not exists certificate_issuances_institution_created_at_idx
  on certificate_issuances (institution_id, created_at desc);

create table if not exists audit_logs (
  id text primary key,
  actor_id text null,
  action text not null,
  resource_type text not null,
  resource_id text not null,
  detail jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_resource_lookup_idx
  on audit_logs (resource_type, resource_id, created_at desc);

insert into institutions (id, code, name)
values ('inst_demo', 'DEMO', 'TrustAnchor Demo Institution')
on conflict (id) do nothing;
