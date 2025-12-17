ALTER TABLE "track_member" DROP CONSTRAINT "track_member_board_member_id_board_member_id_fk";
--> statement-breakpoint
ALTER TABLE "board_member" ADD COLUMN "role" text DEFAULT 'member' NOT NULL;--> statement-breakpoint
ALTER TABLE "track_member" ADD COLUMN "role" text DEFAULT 'member' NOT NULL;--> statement-breakpoint
ALTER TABLE "track_member" DROP COLUMN "board_member_id";--> statement-breakpoint
ALTER TABLE "track_member" DROP COLUMN "is_leader";