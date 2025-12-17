ALTER TABLE "tasc_member" DROP CONSTRAINT "tasc_member_track_member_id_track_member_id_fk";
--> statement-breakpoint
ALTER TABLE "tasc_member" ADD COLUMN "role" text DEFAULT 'member' NOT NULL;--> statement-breakpoint
ALTER TABLE "tasc_member" DROP COLUMN "track_member_id";