// User & Authentication Types
// Only two user roles: Artist (creates art) and Agent (buyer who sources/purchases art)
export type UserRole = 'artist' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: UserRole;
  createdAt: Date;
}

// Verification Types
export type VerificationStatus = 'pending' | 'in_review' | 'verified' | 'flagged' | 'rejected';

export type ArtworkMedium =
  | 'Digital Painting'
  | 'Oil Painting'
  | 'Watercolor'
  | 'Photography'
  | 'Mixed Media'
  | '3D Render'
  | 'Vector Art'
  | 'Sculpture';

export type ProofType = 'sketch' | 'layer_structure' | 'timelapse' | 'reference' | 'wip';

export type AuditResult = 'passed' | 'warning' | 'failed';

export type LicenseType = 'personal' | 'commercial' | 'exclusive';

// Process Proof Interface
export interface ProcessProof {
  id: string;
  type: ProofType;
  title: string;
  thumbnail: string;
  fileName: string;
  fileSize: string;
  uploadedAt: Date;
  metadata?: {
    software?: string;
    duration?: string;
    layerCount?: number;
  };
  verified: boolean;
}

// Verification Result Interface
export interface VerificationResult {
  humanScore: number;
  aiProbability: number;
  metadataAudit: AuditResult;
  layerAnalysis: AuditResult;
  processVerification: AuditResult;
  styleConsistency: AuditResult;
  notes?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export type BidStatus = 'pending' | 'accepted' | 'rejected' | 'outbid';

export interface Bid {
  id: string;
  artworkId: string;
  bidderId: string;
  bidderName: string;
  bidderAvatar: string;
  amount: number;
  timestamp: Date;
  status: BidStatus;
}

export interface AuctionInfo {
  startingPrice: number;
  currentHighestBid?: number;
  reservePrice?: number;
  endTime: Date;
  status: 'active' | 'ended' | 'awaiting_payment';
}

// Artwork Interface
export interface Artwork {
  id: string;
  title: string;
  description: string;
  artistId: string;
  artistName: string;
  artistAvatar: string;
  medium: ArtworkMedium;
  tools: string[];
  imageUrl: string;
  thumbnailUrl: string;
  createdAt: Date;
  uploadedAt: Date;
  status: VerificationStatus;
  processProofs: ProcessProof[];
  verificationResult?: VerificationResult;
  certificateId?: string;
  edition?: string;
  dimensions?: string;
  price?: number;
  auctionInfo?: AuctionInfo;
  licenseType?: LicenseType;
  tags: string[];
  views: number;
  likes: number;
  shortlisted: number;
}

// Filter Types
export interface ArtworkFilters {
  status?: VerificationStatus[];
  medium?: ArtworkMedium[];
  minPrice?: number;
  maxPrice?: number;
  minHumanScore?: number;
}

// Statistics Types
export interface ArtworkStatistics {
  totalArtworks: number;
  verifiedCount: number;
  pendingCount: number;
  flaggedCount: number;
  averageHumanScore: number;
}

// Toast/Notification Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'system';

// Chat Types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'text' | 'image' | 'artwork';
  artworkId?: string;
  replyToId?: string;
  replyToContent?: string;
  replyToName?: string;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  artworkId?: string;
  artworkTitle?: string;
  artworkThumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Navigation Types
export type RootStackParamList = {
  index: undefined;
  '(artist)': undefined;
  '(agent)': undefined;
  'artwork/[id]': { id: string };
};
