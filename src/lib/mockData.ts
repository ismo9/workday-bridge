export const businessObjects = [
  { id: "workers", name: "Workers", description: "Employee master data", fieldCount: 42, mappingsCount: 6, datasetsCount: 12, icon: "Users", color: "primary" },
  { id: "customers", name: "Customers", description: "Customer accounts and contacts", fieldCount: 28, mappingsCount: 4, datasetsCount: 8, icon: "Building2", color: "info" },
  { id: "cost-centers", name: "Cost Centers", description: "Organizational cost structures", fieldCount: 18, mappingsCount: 3, datasetsCount: 5, icon: "Wallet", color: "success" },
  { id: "suppliers", name: "Suppliers", description: "Vendor & supplier records", fieldCount: 24, mappingsCount: 2, datasetsCount: 4, icon: "Truck", color: "warning" },
  { id: "positions", name: "Positions", description: "Job positions catalog", fieldCount: 22, mappingsCount: 5, datasetsCount: 7, icon: "Briefcase", color: "chart-5" },
  { id: "locations", name: "Locations", description: "Physical & legal locations", fieldCount: 16, mappingsCount: 2, datasetsCount: 3, icon: "MapPin", color: "primary" },
];

export const datasets = [
  { id: "ds1", name: "workers_q4_2025.csv", businessObject: "Workers", rows: 1248, columns: 18, uploadedAt: "2026-04-28", uploadedBy: "Sarah Lin", status: "Mapped" },
  { id: "ds2", name: "new_hires_eu.csv", businessObject: "Workers", rows: 312, columns: 22, uploadedAt: "2026-04-30", uploadedBy: "Marc Dubois", status: "Pending" },
  { id: "ds3", name: "customers_emea.csv", businessObject: "Customers", rows: 5621, columns: 14, uploadedAt: "2026-04-29", uploadedBy: "Aisha Khan", status: "Imported" },
  { id: "ds4", name: "cost_centers_2026.csv", businessObject: "Cost Centers", rows: 184, columns: 9, uploadedAt: "2026-04-25", uploadedBy: "Sarah Lin", status: "Mapped" },
  { id: "ds5", name: "suppliers_apac.csv", businessObject: "Suppliers", rows: 432, columns: 16, uploadedAt: "2026-04-22", uploadedBy: "Hiro Tanaka", status: "Failed" },
];

export const mappings = [
  { id: "m1", name: "Workers Standard EU", businessObject: "Workers", fields: 18, rules: 4, version: "v3", active: true, lastUsed: "2026-04-30", createdBy: "Sarah Lin" },
  { id: "m2", name: "Workers Onboarding US", businessObject: "Workers", fields: 22, rules: 6, version: "v2", active: true, lastUsed: "2026-04-28", createdBy: "Marc Dubois" },
  { id: "m3", name: "Customers EMEA Default", businessObject: "Customers", fields: 14, rules: 2, version: "v1", active: true, lastUsed: "2026-04-29", createdBy: "Aisha Khan" },
  { id: "m4", name: "Cost Centers FY26", businessObject: "Cost Centers", fields: 9, rules: 1, version: "v1", active: false, lastUsed: "2026-03-12", createdBy: "Sarah Lin" },
  { id: "m5", name: "Suppliers Global", businessObject: "Suppliers", fields: 12, rules: 3, version: "v2", active: true, lastUsed: "2026-04-22", createdBy: "Hiro Tanaka" },
];

export const imports = [
  { id: "imp1001", dataset: "workers_q4_2025.csv", mapping: "Workers Standard EU", status: "Success", total: 1248, success: 1248, failed: 0, startedAt: "2026-04-30 09:12", duration: "2m 14s", user: "Sarah Lin" },
  { id: "imp1002", dataset: "customers_emea.csv", mapping: "Customers EMEA Default", status: "Success", total: 5621, success: 5598, failed: 23, startedAt: "2026-04-29 14:33", duration: "8m 02s", user: "Aisha Khan" },
  { id: "imp1003", dataset: "suppliers_apac.csv", mapping: "Suppliers Global", status: "Failed", total: 432, success: 0, failed: 432, startedAt: "2026-04-22 11:05", duration: "0m 18s", user: "Hiro Tanaka" },
  { id: "imp1004", dataset: "new_hires_eu.csv", mapping: "Workers Standard EU", status: "Running", total: 312, success: 187, failed: 4, startedAt: "2026-05-02 10:22", duration: "—", user: "Marc Dubois" },
  { id: "imp1005", dataset: "cost_centers_2026.csv", mapping: "Cost Centers FY26", status: "Pending", total: 184, success: 0, failed: 0, startedAt: "—", duration: "—", user: "Sarah Lin" },
];

export const importTrend = [
  { day: "Mon", success: 4200, failed: 80 },
  { day: "Tue", success: 5100, failed: 120 },
  { day: "Wed", success: 3800, failed: 40 },
  { day: "Thu", success: 6700, failed: 210 },
  { day: "Fri", success: 7400, failed: 95 },
  { day: "Sat", success: 1200, failed: 5 },
  { day: "Sun", success: 980, failed: 0 },
];

export const users = [
  { id: "u1", name: "Sarah Lin", email: "sarah.lin@acme.com", role: "Administrator", tenant: "Acme Corp", status: "Active", lastLogin: "2026-05-02" },
  { id: "u2", name: "Marc Dubois", email: "marc@acme.com", role: "Consultant", tenant: "Acme Corp", status: "Active", lastLogin: "2026-05-01" },
  { id: "u3", name: "Aisha Khan", email: "aisha@globex.com", role: "Client", tenant: "Globex", status: "Active", lastLogin: "2026-04-30" },
  { id: "u4", name: "Hiro Tanaka", email: "hiro@initech.jp", role: "Client", tenant: "Initech", status: "Inactive", lastLogin: "2026-04-22" },
  { id: "u5", name: "Elena Rossi", email: "elena@acme.com", role: "Consultant", tenant: "Acme Corp", status: "Active", lastLogin: "2026-05-02" },
];

export const tenants = [
  { id: "t1", name: "Acme Corp", users: 24, datasets: 142, imports: 1820, plan: "Enterprise", status: "Active" },
  { id: "t2", name: "Globex", users: 8, datasets: 56, imports: 420, plan: "Pro", status: "Active" },
  { id: "t3", name: "Initech", users: 3, datasets: 18, imports: 92, plan: "Starter", status: "Trial" },
];

export const sampleCsvColumns = ["employee_id", "first_name", "last_name", "email", "hire_date", "department", "country", "job_title", "manager_id", "salary"];
export const sampleCsvRows = [
  ["E1001", "John", "Doe", "john.doe@acme.com", "2024-03-12", "Engineering", "FR", "Senior Engineer", "E0021", "75000"],
  ["E1002", "Marie", "Leclerc", "marie.l@acme.com", "2023-11-04", "Finance", "FR", "Analyst", "E0014", "62000"],
  ["E1003", "Aiko", "Tanaka", "aiko@acme.com", "2025-01-20", "Product", "JP", "PM", "E0008", "88000"],
  ["E1004", "Carlos", "Perez", "carlos@acme.com", "2022-06-30", "Sales", "ES", "Account Exec", "E0017", "70000"],
  ["E1005", "Priya", "Singh", "priya@acme.com", "2024-09-09", "Engineering", "IN", "Engineer II", "E0021", "58000"],
];

export const workdayFields = [
  { id: "WorkerID", label: "Worker ID", required: true, type: "text" },
  { id: "FirstName", label: "First Name", required: true, type: "text" },
  { id: "LastName", label: "Last Name", required: true, type: "text" },
  { id: "FullName", label: "Full Name", required: false, type: "composite" },
  { id: "Email", label: "Primary Email", required: true, type: "email" },
  { id: "HireDate", label: "Hire Date", required: true, type: "date" },
  { id: "Department", label: "Organization", required: true, type: "enum" },
  { id: "Country", label: "Country", required: true, type: "enum" },
  { id: "JobTitle", label: "Job Title", required: true, type: "text" },
  { id: "ManagerID", label: "Manager", required: false, type: "reference" },
  { id: "Compensation", label: "Annual Compensation", required: false, type: "number" },
];
