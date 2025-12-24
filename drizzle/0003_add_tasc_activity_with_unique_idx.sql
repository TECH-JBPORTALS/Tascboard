CREATE TABLE "tasc_activity" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"tasc_id" text NOT NULL,
	"performed_by" text,
	"reason" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tasc" ALTER COLUMN "started_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "tasc" ALTER COLUMN "completed_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "tasc_activity" ADD CONSTRAINT "tasc_activity_tasc_id_tasc_id_fk" FOREIGN KEY ("tasc_id") REFERENCES "public"."tasc"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasc_activity" ADD CONSTRAINT "tasc_activity_performed_by_user_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "board_member_board_id_user_id_index" ON "board_member" USING btree ("board_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tasc_member_tasc_id_user_id_index" ON "tasc_member" USING btree ("tasc_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "track_member_track_id_user_id_index" ON "track_member" USING btree ("track_id","user_id");