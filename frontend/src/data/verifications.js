export const mockVerifications = [
  {
    id: "req-101",
    hostId: 1002,
    hostName: "Sarah Jenkins",
    email: "sarah.j@example.com",
    phone: "+1 (555) 876-5432",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    documentType: "National ID Card",
    documentNumber: "ID-982347102",
    documentFront:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600",
    documentBack:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600",
    selfieImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    submittedDate: "Aug 08, 2026",
    status: "Pending", // "Pending", "Approved", "Rejected"
    propertyCount: 2,
  },
  {
    id: "req-102",
    hostId: 1003,
    hostName: "David Wright",
    email: "david.wright@example.com",
    phone: "+1 (555) 345-6789",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
    documentType: "Passport",
    documentNumber: "PASS-US-482019",
    documentFront:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600",
    documentBack: null,
    selfieImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    submittedDate: "Aug 05, 2026",
    status: "Pending",
    propertyCount: 1,
  },
  {
    id: "req-103",
    hostId: 1001,
    hostName: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+1 (555) 234-5678",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    documentType: "Driver's License",
    documentNumber: "DL-88301923",
    documentFront:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600",
    documentBack:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600",
    selfieImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
    submittedDate: "Jul 28, 2026",
    status: "Approved",
    propertyCount: 4,
  },
  {
    id: "req-104",
    hostId: 1005,
    hostName: "Elena Rostova",
    email: "elena.r@example.com",
    phone: "+1 (555) 998-1122",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    documentType: "National ID Card",
    documentNumber: "ID-11029384",
    documentFront:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600",
    documentBack:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600",
    selfieImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300",
    submittedDate: "Jul 20, 2026",
    status: "Rejected",
    propertyCount: 1,
    rejectionReason: "Unclear document image. Expiry date unreadable.",
  },
];
