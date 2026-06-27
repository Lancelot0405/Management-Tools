// =============================================================================
// FESTMANAGER — db.ts (Re-export bridge — DEPRECATED)
// src/lib/db.ts
//
// File này chỉ còn là compatibility bridge để không break imports cũ.
// Tất cả fetch functions đã được chuyển vào src/services/api/:
//   - fetchStaff           → services/api/staff.ts
//   - fetchEvents          → services/api/events.ts
//   - fetchInventory       → services/api/inventory.ts
//   - fetchInventoryLogs   → services/api/inventory.ts
//   - fetchPendingReg...   → services/api/registrations.ts
//   - fetchClients         → services/api/clients.ts
//
// Không thêm code mới vào đây. Dùng dateHelpers.ts trực tiếp.
// =============================================================================

export { toISODate, fromISODate } from './dateHelpers';
