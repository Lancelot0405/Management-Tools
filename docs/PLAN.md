# Kế Hoạch Phát Triển — Management Tools

## Trạng thái dự án

> **Version:** Alpha → Beta  
> **Nền tảng:** PWA (Mobile-first) + Responsive Desktop  
> **Backend:** Supabase (PostgreSQL + Auth + Realtime)

---

## Tính năng đã hoàn thành ✅

### Core Infrastructure
- [x] React 19 + TypeScript + Vite setup với HeroUI v3
- [x] Supabase integration (Auth, DB, Realtime, Edge Functions)
- [x] PWA manifest + Service Worker (offline support)
- [x] Web Push Notifications (VAPID)
- [x] Dark/Light mode + Accent color picker
- [x] TanStack Query v5 (server state, caching, mutations)
- [x] Role-based access control: `admin` / `manager` / `staff`

### Modules
- [x] **Dashboard** — tổng quan doanh thu, biểu đồ, thống kê
- [x] **Schedule** — quản lý sự kiện (CRUD, calendar view, clone)
  - [x] EventDetail tabs: Info, Staff, Expenses, Inventory, Contracts
  - [x] PDF export sự kiện
- [x] **Inventory** — tồn kho (tìm kiếm, lọc, lịch sử nhập kho)
  - [x] Food Template Manager
  - [x] Responsive: mobile list + desktop table
- [x] **HR** — quản lý nhân sự
  - [x] Danh sách nhân viên (mobile SwipeableRow + desktop Table)
  - [x] Staff Profile với tabs (Tổng quan / Cá nhân / Tài liệu / Chi phí)
  - [x] Add staff form: mobile Modal + desktop Drawer
- [x] **Finance** — báo cáo tài chính, export Excel/PDF
- [x] **Clients** — quản lý đối tác/khách hàng
- [x] **Registration approvals** — admin duyệt đăng ký manager

### UX / Infrastructure
- [x] FAB (Floating Action Button) toàn cục — `useFABRegister`
- [x] Toast notifications — `useToast`
- [x] Error Boundary
- [x] Skeleton loading states
- [x] AppDatePicker, SwipeableRow, DocThumbnail, StatusBadge

---

## Đang phát triển / Backlog 🔄

### Ưu tiên cao
- [ ] **Realtime notifications** — thông báo push khi expense được duyệt/từ chối
- [ ] **Offline mode** — cache inventory + events khi mất mạng
- [ ] **Export nâng cao** — export staff schedule theo tuần/tháng

### Ưu tiên trung bình
- [ ] **Báo cáo nâng cao** — so sánh doanh thu giữa các sự kiện
- [ ] **Bulk actions** — xóa nhiều inventory items cùng lúc
- [ ] **Search toàn cục** — tìm kiếm xuyên suốt modules

### Ưu tiên thấp / Tương lai
- [ ] **Multi-language** — hỗ trợ tiếng Anh (i18n)
- [ ] **Staff scheduling** — lịch phân công chi tiết theo giờ
- [ ] **QR code** — check-in nhân viên bằng QR

---

## Kiến trúc quyết định (ADR)

### ADR-001: HeroUI v3 làm UI Component Library duy nhất
**Lý do:** Tránh mix nhiều UI libraries. HeroUI v3 cung cấp đủ components cho F&B PWA.

### ADR-002: TanStack Query thay vì Redux/Zustand
**Lý do:** Server state chiếm >90% state của app. TanStack Query xử lý cache, refetch, optimistic updates tốt hơn.

### ADR-003: Supabase Edge Functions cho admin operations
**Lý do:** Service role key không được expose ra frontend. Tất cả tác vụ admin đi qua Edge Function.

### ADR-004: Feature-based component structure
**Lý do:** Dễ tìm code liên quan. Mỗi domain (`hr/`, `inventory/`, `schedule/`) tự chứa đủ components.

### ADR-005: PWA với `viewport-fit=cover` bỏ (iOS 26+ regression)
**Lý do:** iOS 26+ có bug với `env(safe-area-inset-top)` trả về `0` lúc cold-start PWA standalone. Chọn phương án A: bỏ `viewport-fit=cover` để OS tự quản lý safe area.
