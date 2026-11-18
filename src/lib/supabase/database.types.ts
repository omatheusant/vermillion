export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      audit_events: {
        Row: {
          action: string;
          actor_id: string | null;
          character_id: string | null;
          chronicle_id: string | null;
          created_at: string;
          id: string;
          justification: string | null;
          payload: NonNullable<Json>;
        };
        ComputedFields: never;
        Insert: {
          action: string;
          actor_id?: string | null;
          character_id?: string | null;
          chronicle_id?: string | null;
          created_at?: string;
          id?: string;
          justification?: string | null;
          payload?: NonNullable<Json>;
        };
        Update: {
          action?: string;
          actor_id?: string | null;
          character_id?: string | null;
          chronicle_id?: string | null;
          created_at?: string;
          id?: string;
          justification?: string | null;
          payload?: NonNullable<Json>;
        };
        Relationships: [
          {
            foreignKeyName: "audit_events_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_events_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "public_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_events_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_events_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "audit_events_chronicle_id_fkey";
            columns: ["chronicle_id"];
            isOneToOne: false;
            referencedRelation: "chronicles";
            referencedColumns: ["id"];
          },
        ];
      };
      character_advantages: {
        Row: {
          character_id: string;
          created_at: string;
          custom_label: string | null;
          dots: number;
          id: string;
          kind: string;
          ref_id: string | null;
          source: Database["public"]["Enums"]["character_advantage_source"];
        };
        ComputedFields: never;
        Insert: {
          character_id: string;
          created_at?: string;
          custom_label?: string | null;
          dots: number;
          id?: string;
          kind: string;
          ref_id?: string | null;
          source?: Database["public"]["Enums"]["character_advantage_source"];
        };
        Update: {
          character_id?: string;
          created_at?: string;
          custom_label?: string | null;
          dots?: number;
          id?: string;
          kind?: string;
          ref_id?: string | null;
          source?: Database["public"]["Enums"]["character_advantage_source"];
        };
        Relationships: [
          {
            foreignKeyName: "character_advantages_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_advantages_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_advantages_ref_id_fkey";
            columns: ["ref_id"];
            isOneToOne: false;
            referencedRelation: "reference_advantages";
            referencedColumns: ["id"];
          },
        ];
      };
      character_attributes: {
        Row: {
          attribute_id: string;
          character_id: string;
          value: number;
        };
        ComputedFields: never;
        Insert: {
          attribute_id: string;
          character_id: string;
          value: number;
        };
        Update: {
          attribute_id?: string;
          character_id?: string;
          value?: number;
        };
        Relationships: [
          {
            foreignKeyName: "character_attributes_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_attributes_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
        ];
      };
      character_convictions: {
        Row: {
          character_id: string;
          created_at: string;
          id: string;
          label: string;
          position: number;
        };
        ComputedFields: never;
        Insert: {
          character_id: string;
          created_at?: string;
          id?: string;
          label: string;
          position?: number;
        };
        Update: {
          character_id?: string;
          created_at?: string;
          id?: string;
          label?: string;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "character_convictions_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_convictions_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
        ];
      };
      character_details: {
        Row: {
          after_embrace: string | null;
          ambition: string | null;
          apparent_age: number | null;
          appearance: string | null;
          character_id: string;
          concept: string | null;
          desire: string | null;
          embrace_account: string | null;
          embrace_date: string | null;
          haven_notes: string | null;
          human_history: string | null;
          nationality: string | null;
          occupation: string | null;
          personality: string | null;
          possessions: string | null;
          private_notes: string | null;
          real_age: number | null;
          real_name: string | null;
          relationships: string | null;
          sire_name: string | null;
          social_name: string | null;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          after_embrace?: string | null;
          ambition?: string | null;
          apparent_age?: number | null;
          appearance?: string | null;
          character_id: string;
          concept?: string | null;
          desire?: string | null;
          embrace_account?: string | null;
          embrace_date?: string | null;
          haven_notes?: string | null;
          human_history?: string | null;
          nationality?: string | null;
          occupation?: string | null;
          personality?: string | null;
          possessions?: string | null;
          private_notes?: string | null;
          real_age?: number | null;
          real_name?: string | null;
          relationships?: string | null;
          sire_name?: string | null;
          social_name?: string | null;
          updated_at?: string;
        };
        Update: {
          after_embrace?: string | null;
          ambition?: string | null;
          apparent_age?: number | null;
          appearance?: string | null;
          character_id?: string;
          concept?: string | null;
          desire?: string | null;
          embrace_account?: string | null;
          embrace_date?: string | null;
          haven_notes?: string | null;
          human_history?: string | null;
          nationality?: string | null;
          occupation?: string | null;
          personality?: string | null;
          possessions?: string | null;
          private_notes?: string | null;
          real_age?: number | null;
          real_name?: string | null;
          relationships?: string | null;
          sire_name?: string | null;
          social_name?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "character_details_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: true;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_details_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: true;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
        ];
      };
      character_disciplines: {
        Row: {
          character_id: string;
          created_at: string;
          discipline_id: string;
          id: string;
          notes: string | null;
          source: Database["public"]["Enums"]["character_discipline_source"];
          value: number;
        };
        ComputedFields: never;
        Insert: {
          character_id: string;
          created_at?: string;
          discipline_id: string;
          id?: string;
          notes?: string | null;
          source?: Database["public"]["Enums"]["character_discipline_source"];
          value: number;
        };
        Update: {
          character_id?: string;
          created_at?: string;
          discipline_id?: string;
          id?: string;
          notes?: string | null;
          source?: Database["public"]["Enums"]["character_discipline_source"];
          value?: number;
        };
        Relationships: [
          {
            foreignKeyName: "character_disciplines_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_disciplines_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_disciplines_discipline_id_fkey";
            columns: ["discipline_id"];
            isOneToOne: false;
            referencedRelation: "reference_disciplines";
            referencedColumns: ["id"];
          },
        ];
      };
      character_edit_sessions: {
        Row: {
          character_id: string;
          client_label: string | null;
          last_seen_at: string;
          session_id: string;
          step: number;
        };
        ComputedFields: never;
        Insert: {
          character_id: string;
          client_label?: string | null;
          last_seen_at?: string;
          session_id: string;
          step: number;
        };
        Update: {
          character_id?: string;
          client_label?: string | null;
          last_seen_at?: string;
          session_id?: string;
          step?: number;
        };
        Relationships: [
          {
            foreignKeyName: "character_edit_sessions_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_edit_sessions_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
        ];
      };
      character_flaws: {
        Row: {
          character_id: string;
          created_at: string;
          custom_label: string | null;
          dots: number;
          id: string;
          ref_id: string | null;
          source: Database["public"]["Enums"]["character_advantage_source"];
        };
        ComputedFields: never;
        Insert: {
          character_id: string;
          created_at?: string;
          custom_label?: string | null;
          dots: number;
          id?: string;
          ref_id?: string | null;
          source?: Database["public"]["Enums"]["character_advantage_source"];
        };
        Update: {
          character_id?: string;
          created_at?: string;
          custom_label?: string | null;
          dots?: number;
          id?: string;
          ref_id?: string | null;
          source?: Database["public"]["Enums"]["character_advantage_source"];
        };
        Relationships: [
          {
            foreignKeyName: "character_flaws_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_flaws_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_flaws_ref_id_fkey";
            columns: ["ref_id"];
            isOneToOne: false;
            referencedRelation: "reference_advantages";
            referencedColumns: ["id"];
          },
        ];
      };
      character_powers: {
        Row: {
          character_id: string;
          created_at: string;
          custom_level: number | null;
          custom_name: string | null;
          custom_summary: string | null;
          discipline_id: string;
          granted_by_narrator_id: string | null;
          id: string;
          power_ref_id: string | null;
          source_reference: string | null;
        };
        ComputedFields: never;
        Insert: {
          character_id: string;
          created_at?: string;
          custom_level?: number | null;
          custom_name?: string | null;
          custom_summary?: string | null;
          discipline_id: string;
          granted_by_narrator_id?: string | null;
          id?: string;
          power_ref_id?: string | null;
          source_reference?: string | null;
        };
        Update: {
          character_id?: string;
          created_at?: string;
          custom_level?: number | null;
          custom_name?: string | null;
          custom_summary?: string | null;
          discipline_id?: string;
          granted_by_narrator_id?: string | null;
          id?: string;
          power_ref_id?: string | null;
          source_reference?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "character_powers_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_powers_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_powers_discipline_id_fkey";
            columns: ["discipline_id"];
            isOneToOne: false;
            referencedRelation: "reference_disciplines";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_powers_granted_by_narrator_id_fkey";
            columns: ["granted_by_narrator_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_powers_granted_by_narrator_id_fkey";
            columns: ["granted_by_narrator_id"];
            isOneToOne: false;
            referencedRelation: "public_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_powers_power_ref_id_fkey";
            columns: ["power_ref_id"];
            isOneToOne: false;
            referencedRelation: "reference_powers";
            referencedColumns: ["id"];
          },
        ];
      };
      character_revisions: {
        Row: {
          character_id: string;
          created_at: string;
          created_by: string | null;
          id: string;
          reason: Database["public"]["Enums"]["character_revision_reason"];
          snapshot: NonNullable<Json>;
        };
        ComputedFields: never;
        Insert: {
          character_id: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          reason: Database["public"]["Enums"]["character_revision_reason"];
          snapshot: NonNullable<Json>;
        };
        Update: {
          character_id?: string;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          reason?: Database["public"]["Enums"]["character_revision_reason"];
          snapshot?: NonNullable<Json>;
        };
        Relationships: [
          {
            foreignKeyName: "character_revisions_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_revisions_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_revisions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_revisions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "public_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      character_skills: {
        Row: {
          character_id: string;
          skill_id: string;
          value: number;
        };
        ComputedFields: never;
        Insert: {
          character_id: string;
          skill_id: string;
          value: number;
        };
        Update: {
          character_id?: string;
          skill_id?: string;
          value?: number;
        };
        Relationships: [
          {
            foreignKeyName: "character_skills_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_skills_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
        ];
      };
      character_specializations: {
        Row: {
          character_id: string;
          created_at: string;
          id: string;
          is_free: boolean;
          label: string;
          skill_id: string;
        };
        ComputedFields: never;
        Insert: {
          character_id: string;
          created_at?: string;
          id?: string;
          is_free?: boolean;
          label: string;
          skill_id: string;
        };
        Update: {
          character_id?: string;
          created_at?: string;
          id?: string;
          is_free?: boolean;
          label?: string;
          skill_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "character_specializations_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_specializations_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
        ];
      };
      character_touchstones: {
        Row: {
          bond: string | null;
          character_id: string;
          conviction_id: string | null;
          created_at: string;
          id: string;
          is_private: boolean;
          meaning: string | null;
          name: string;
          status: string | null;
        };
        ComputedFields: never;
        Insert: {
          bond?: string | null;
          character_id: string;
          conviction_id?: string | null;
          created_at?: string;
          id?: string;
          is_private?: boolean;
          meaning?: string | null;
          name: string;
          status?: string | null;
        };
        Update: {
          bond?: string | null;
          character_id?: string;
          conviction_id?: string | null;
          created_at?: string;
          id?: string;
          is_private?: boolean;
          meaning?: string | null;
          name?: string;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "character_touchstones_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_touchstones_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_touchstones_conviction_id_fkey";
            columns: ["conviction_id"];
            isOneToOne: false;
            referencedRelation: "character_convictions";
            referencedColumns: ["id"];
          },
        ];
      };
      character_tracks: {
        Row: {
          blood_potency: number;
          character_id: string;
          health_aggravated: number;
          health_max: number;
          health_superficial: number;
          humanity: number;
          hunger: number;
          updated_at: string;
          willpower_aggravated: number;
          willpower_max: number;
          willpower_superficial: number;
        };
        ComputedFields: never;
        Insert: {
          blood_potency?: number;
          character_id: string;
          health_aggravated?: number;
          health_max?: number;
          health_superficial?: number;
          humanity?: number;
          hunger?: number;
          updated_at?: string;
          willpower_aggravated?: number;
          willpower_max?: number;
          willpower_superficial?: number;
        };
        Update: {
          blood_potency?: number;
          character_id?: string;
          health_aggravated?: number;
          health_max?: number;
          health_superficial?: number;
          humanity?: number;
          hunger?: number;
          updated_at?: string;
          willpower_aggravated?: number;
          willpower_max?: number;
          willpower_superficial?: number;
        };
        Relationships: [
          {
            foreignKeyName: "character_tracks_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: true;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "character_tracks_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: true;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
        ];
      };
      characters: {
        Row: {
          chronicle_id: string;
          clan_id: string | null;
          created_at: string;
          creation_step: number;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token: string | null;
          ruleset_version: string;
          sect: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset: string | null;
          slot_number: number | null;
          slug: string | null;
          status: Database["public"]["Enums"]["character_status"];
          updated_at: string;
          version: number;
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        ComputedFields: never;
        Insert: {
          chronicle_id: string;
          clan_id?: string | null;
          created_at?: string;
          creation_step?: number;
          id?: string;
          lineage?: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token?: string | null;
          ruleset_version?: string;
          sect?: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset?: string | null;
          slot_number?: number | null;
          slug?: string | null;
          status?: Database["public"]["Enums"]["character_status"];
          updated_at?: string;
          version?: number;
          visibility?: Database["public"]["Enums"]["character_visibility"];
        };
        Update: {
          chronicle_id?: string;
          clan_id?: string | null;
          created_at?: string;
          creation_step?: number;
          id?: string;
          lineage?: Database["public"]["Enums"]["character_lineage"];
          name?: string;
          owner_id?: string;
          public_share_token?: string | null;
          ruleset_version?: string;
          sect?: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset?: string | null;
          slot_number?: number | null;
          slug?: string | null;
          status?: Database["public"]["Enums"]["character_status"];
          updated_at?: string;
          version?: number;
          visibility?: Database["public"]["Enums"]["character_visibility"];
        };
        Relationships: [
          {
            foreignKeyName: "characters_chronicle_id_fkey";
            columns: ["chronicle_id"];
            isOneToOne: false;
            referencedRelation: "chronicles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "characters_clan_id_fkey";
            columns: ["clan_id"];
            isOneToOne: false;
            referencedRelation: "reference_clans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "characters_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "characters_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "public_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      chronicle_memberships: {
        Row: {
          chronicle_id: string;
          created_at: string;
          id: string;
          invited_by: string | null;
          role: Database["public"]["Enums"]["chronicle_role"];
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          chronicle_id: string;
          created_at?: string;
          id?: string;
          invited_by?: string | null;
          role: Database["public"]["Enums"]["chronicle_role"];
          user_id: string;
        };
        Update: {
          chronicle_id?: string;
          created_at?: string;
          id?: string;
          invited_by?: string | null;
          role?: Database["public"]["Enums"]["chronicle_role"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chronicle_memberships_chronicle_id_fkey";
            columns: ["chronicle_id"];
            isOneToOne: false;
            referencedRelation: "chronicles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chronicle_memberships_invited_by_fkey";
            columns: ["invited_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chronicle_memberships_invited_by_fkey";
            columns: ["invited_by"];
            isOneToOne: false;
            referencedRelation: "public_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chronicle_memberships_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chronicle_memberships_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "public_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      chronicles: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          settings: NonNullable<Json>;
          slug: string;
          updated_at: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          settings?: NonNullable<Json>;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          settings?: NonNullable<Json>;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          character_id: string | null;
          created_at: string;
          id: string;
          kind: Database["public"]["Enums"]["media_kind"];
          mime_type: string;
          owner_id: string;
          storage_path: string;
        };
        ComputedFields: never;
        Insert: {
          character_id?: string | null;
          created_at?: string;
          id?: string;
          kind: Database["public"]["Enums"]["media_kind"];
          mime_type: string;
          owner_id: string;
          storage_path: string;
        };
        Update: {
          character_id?: string | null;
          created_at?: string;
          id?: string;
          kind?: Database["public"]["Enums"]["media_kind"];
          mime_type?: string;
          owner_id?: string;
          storage_path?: string;
        };
        Relationships: [
          {
            foreignKeyName: "media_assets_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "media_assets_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "media_assets_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "media_assets_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "public_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_media_id: string | null;
          bio: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          preferences: NonNullable<Json>;
          updated_at: string;
          username: string;
        };
        ComputedFields: never;
        Insert: {
          avatar_media_id?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id: string;
          preferences?: NonNullable<Json>;
          updated_at?: string;
          username: string;
        };
        Update: {
          avatar_media_id?: string | null;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          preferences?: NonNullable<Json>;
          updated_at?: string;
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_profiles_avatar_media";
            columns: ["avatar_media_id"];
            isOneToOne: false;
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          },
        ];
      };
      reference_advantages: {
        Row: {
          created_at: string;
          dots_max: number;
          dots_min: number;
          id: string;
          kind: Database["public"]["Enums"]["reference_advantage_kind"];
          lineage_restriction: string | null;
          name: string;
          source_document: string | null;
          source_page: string | null;
          summary: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          dots_max?: number;
          dots_min?: number;
          id?: string;
          kind: Database["public"]["Enums"]["reference_advantage_kind"];
          lineage_restriction?: string | null;
          name: string;
          source_document?: string | null;
          source_page?: string | null;
          summary: string;
        };
        Update: {
          created_at?: string;
          dots_max?: number;
          dots_min?: number;
          id?: string;
          kind?: Database["public"]["Enums"]["reference_advantage_kind"];
          lineage_restriction?: string | null;
          name?: string;
          source_document?: string | null;
          source_page?: string | null;
          summary?: string;
        };
        Relationships: [];
      };
      reference_clans: {
        Row: {
          bane_summary: string | null;
          compulsion_summary: string | null;
          created_at: string;
          disciplines: string[];
          epithet: string | null;
          flavor_text: string | null;
          id: string;
          name: string;
          source_document: string;
          source_page: string | null;
          strengths_summary: string | null;
          typical_affiliations: string[];
        };
        ComputedFields: never;
        Insert: {
          bane_summary?: string | null;
          compulsion_summary?: string | null;
          created_at?: string;
          disciplines?: string[];
          epithet?: string | null;
          flavor_text?: string | null;
          id: string;
          name: string;
          source_document: string;
          source_page?: string | null;
          strengths_summary?: string | null;
          typical_affiliations?: string[];
        };
        Update: {
          bane_summary?: string | null;
          compulsion_summary?: string | null;
          created_at?: string;
          disciplines?: string[];
          epithet?: string | null;
          flavor_text?: string | null;
          id?: string;
          name?: string;
          source_document?: string;
          source_page?: string | null;
          strengths_summary?: string | null;
          typical_affiliations?: string[];
        };
        Relationships: [];
      };
      reference_disciplines: {
        Row: {
          clans: string[];
          created_at: string;
          id: string;
          name: string;
          source_document: string | null;
          source_page: string | null;
        };
        ComputedFields: never;
        Insert: {
          clans?: string[];
          created_at?: string;
          id: string;
          name: string;
          source_document?: string | null;
          source_page?: string | null;
        };
        Update: {
          clans?: string[];
          created_at?: string;
          id?: string;
          name?: string;
          source_document?: string | null;
          source_page?: string | null;
        };
        Relationships: [];
      };
      reference_powers: {
        Row: {
          amalgam: string | null;
          created_at: string;
          discipline_id: string;
          id: string;
          level: number;
          name: string;
          prerequisites: string | null;
          source_document: string | null;
          source_page: string | null;
          summary: string | null;
          verification_status: Database["public"]["Enums"]["reference_verification_status"];
        };
        ComputedFields: never;
        Insert: {
          amalgam?: string | null;
          created_at?: string;
          discipline_id: string;
          id?: string;
          level: number;
          name: string;
          prerequisites?: string | null;
          source_document?: string | null;
          source_page?: string | null;
          summary?: string | null;
          verification_status?: Database["public"]["Enums"]["reference_verification_status"];
        };
        Update: {
          amalgam?: string | null;
          created_at?: string;
          discipline_id?: string;
          id?: string;
          level?: number;
          name?: string;
          prerequisites?: string | null;
          source_document?: string | null;
          source_page?: string | null;
          summary?: string | null;
          verification_status?: Database["public"]["Enums"]["reference_verification_status"];
        };
        Relationships: [
          {
            foreignKeyName: "reference_powers_discipline_id_fkey";
            columns: ["discipline_id"];
            isOneToOne: false;
            referencedRelation: "reference_disciplines";
            referencedColumns: ["id"];
          },
        ];
      };
      reference_predator_types: {
        Row: {
          created_at: string;
          disciplines: string[];
          id: string;
          name: string;
          source_document: string | null;
          source_page: string | null;
          summary: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          disciplines?: string[];
          id: string;
          name: string;
          source_document?: string | null;
          source_page?: string | null;
          summary: string;
        };
        Update: {
          created_at?: string;
          disciplines?: string[];
          id?: string;
          name?: string;
          source_document?: string | null;
          source_page?: string | null;
          summary?: string;
        };
        Relationships: [];
      };
      review_events: {
        Row: {
          action: Database["public"]["Enums"]["review_event_action"];
          character_id: string;
          comment: string | null;
          created_at: string;
          id: string;
          reviewer_id: string | null;
        };
        ComputedFields: never;
        Insert: {
          action: Database["public"]["Enums"]["review_event_action"];
          character_id: string;
          comment?: string | null;
          created_at?: string;
          id?: string;
          reviewer_id?: string | null;
        };
        Update: {
          action?: Database["public"]["Enums"]["review_event_action"];
          character_id?: string;
          comment?: string | null;
          created_at?: string;
          id?: string;
          reviewer_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "review_events_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "review_events_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "review_events_reviewer_id_fkey";
            columns: ["reviewer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "review_events_reviewer_id_fkey";
            columns: ["reviewer_id"];
            isOneToOne: false;
            referencedRelation: "public_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      xp_ledger: {
        Row: {
          applied_at: string | null;
          approved_by: string | null;
          category: string;
          character_id: string;
          created_at: string;
          created_by: string | null;
          delta: number;
          id: string;
          reason: string;
        };
        ComputedFields: never;
        Insert: {
          applied_at?: string | null;
          approved_by?: string | null;
          category: string;
          character_id: string;
          created_at?: string;
          created_by?: string | null;
          delta: number;
          id?: string;
          reason: string;
        };
        Update: {
          applied_at?: string | null;
          approved_by?: string | null;
          category?: string;
          character_id?: string;
          created_at?: string;
          created_by?: string | null;
          delta?: number;
          id?: string;
          reason?: string;
        };
        Relationships: [
          {
            foreignKeyName: "xp_ledger_approved_by_fkey";
            columns: ["approved_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "xp_ledger_approved_by_fkey";
            columns: ["approved_by"];
            isOneToOne: false;
            referencedRelation: "public_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "xp_ledger_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "xp_ledger_character_id_fkey";
            columns: ["character_id"];
            isOneToOne: false;
            referencedRelation: "public_characters";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "xp_ledger_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "xp_ledger_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "public_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      public_characters: {
        Row: {
          ambition: string | null;
          apparent_age: number | null;
          appearance: string | null;
          clan_id: string | null;
          concept: string | null;
          created_at: string;
          desire: string | null;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          nationality: string | null;
          occupation: string | null;
          owner_id: string;
          personality: string | null;
          public_share_token: string | null;
          slug: string | null;
          social_name: string | null;
          status: Database["public"]["Enums"]["character_status"];
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        ComputedFields: never;
        Relationships: [
          {
            foreignKeyName: "characters_clan_id_fkey";
            columns: ["clan_id"];
            isOneToOne: false;
            referencedRelation: "reference_clans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "characters_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "characters_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "public_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      public_profiles: {
        Row: {
          avatar_media_id: string | null;
          bio: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          username: string;
        };
        ComputedFields: never;
        Insert: {
          avatar_media_id?: string | null;
          bio?: string | null;
          created_at?: string | null;
          display_name?: string | null;
          id?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_media_id?: string | null;
          bio?: string | null;
          created_at?: string | null;
          display_name?: string | null;
          id?: string | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_profiles_avatar_media";
            columns: ["avatar_media_id"];
            isOneToOne: false;
            referencedRelation: "media_assets";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      approve_character: {
        Args: { p_character_id: string; p_comment?: string };
        Returns: {
          chronicle_id: string;
          clan_id: string | null;
          created_at: string;
          creation_step: number;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token: string | null;
          ruleset_version: string;
          sect: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset: string | null;
          slot_number: number | null;
          slug: string | null;
          status: Database["public"]["Enums"]["character_status"];
          updated_at: string;
          version: number;
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        SetofOptions: {
          from: "*";
          to: "characters";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      archive_character: {
        Args: { p_character_id: string };
        Returns: {
          chronicle_id: string;
          clan_id: string | null;
          created_at: string;
          creation_step: number;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token: string | null;
          ruleset_version: string;
          sect: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset: string | null;
          slot_number: number | null;
          slug: string | null;
          status: Database["public"]["Enums"]["character_status"];
          updated_at: string;
          version: number;
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        SetofOptions: {
          from: "*";
          to: "characters";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      build_character_snapshot: { Args: { p_character_id: string }; Returns: Json };
      check_character_version: {
        Args: { p_character_id: string; p_expected_version: number };
        Returns: {
          chronicle_id: string;
          clan_id: string | null;
          created_at: string;
          creation_step: number;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token: string | null;
          ruleset_version: string;
          sect: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset: string | null;
          slot_number: number | null;
          slug: string | null;
          status: Database["public"]["Enums"]["character_status"];
          updated_at: string;
          version: number;
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        SetofOptions: {
          from: "*";
          to: "characters";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      create_character_draft: {
        Args: { p_chronicle_id: string; p_name: string };
        Returns: {
          chronicle_id: string;
          clan_id: string | null;
          created_at: string;
          creation_step: number;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token: string | null;
          ruleset_version: string;
          sect: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset: string | null;
          slot_number: number | null;
          slug: string | null;
          status: Database["public"]["Enums"]["character_status"];
          updated_at: string;
          version: number;
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        SetofOptions: {
          from: "*";
          to: "characters";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      export_character_json: { Args: { p_character_id: string }; Returns: Json };
      grant_narrator_power: {
        Args: {
          p_character_id: string;
          p_custom_level: number;
          p_custom_name: string;
          p_custom_summary: string;
          p_discipline_id: string;
          p_source_reference: string;
        };
        Returns: {
          character_id: string;
          created_at: string;
          custom_level: number | null;
          custom_name: string | null;
          custom_summary: string | null;
          discipline_id: string;
          granted_by_narrator_id: string | null;
          id: string;
          power_ref_id: string | null;
          source_reference: string | null;
        };
        SetofOptions: {
          from: "*";
          to: "character_powers";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      is_character_owner: { Args: { p_character_id: string }; Returns: boolean };
      is_character_owner_or_staff: { Args: { p_character_id: string }; Returns: boolean };
      is_chronicle_staff: { Args: { p_chronicle_id: string }; Returns: boolean };
      publish_character: {
        Args: { p_character_id: string };
        Returns: {
          chronicle_id: string;
          clan_id: string | null;
          created_at: string;
          creation_step: number;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token: string | null;
          ruleset_version: string;
          sect: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset: string | null;
          slot_number: number | null;
          slug: string | null;
          status: Database["public"]["Enums"]["character_status"];
          updated_at: string;
          version: number;
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        SetofOptions: {
          from: "*";
          to: "characters";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      request_character_changes: {
        Args: { p_character_id: string; p_comment: string };
        Returns: {
          chronicle_id: string;
          clan_id: string | null;
          created_at: string;
          creation_step: number;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token: string | null;
          ruleset_version: string;
          sect: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset: string | null;
          slot_number: number | null;
          slug: string | null;
          status: Database["public"]["Enums"]["character_status"];
          updated_at: string;
          version: number;
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        SetofOptions: {
          from: "*";
          to: "characters";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      save_character_advantages: {
        Args: { p_character_id: string; p_expected_version: number; p_flaws: Json; p_merits: Json };
        Returns: {
          chronicle_id: string;
          clan_id: string | null;
          created_at: string;
          creation_step: number;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token: string | null;
          ruleset_version: string;
          sect: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset: string | null;
          slot_number: number | null;
          slug: string | null;
          status: Database["public"]["Enums"]["character_status"];
          updated_at: string;
          version: number;
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        SetofOptions: {
          from: "*";
          to: "characters";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      save_character_attributes: {
        Args: { p_attributes: Json; p_character_id: string; p_expected_version: number };
        Returns: {
          chronicle_id: string;
          clan_id: string | null;
          created_at: string;
          creation_step: number;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token: string | null;
          ruleset_version: string;
          sect: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset: string | null;
          slot_number: number | null;
          slug: string | null;
          status: Database["public"]["Enums"]["character_status"];
          updated_at: string;
          version: number;
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        SetofOptions: {
          from: "*";
          to: "characters";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      save_character_disciplines: {
        Args: { p_character_id: string; p_disciplines: Json; p_expected_version: number };
        Returns: {
          chronicle_id: string;
          clan_id: string | null;
          created_at: string;
          creation_step: number;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token: string | null;
          ruleset_version: string;
          sect: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset: string | null;
          slot_number: number | null;
          slug: string | null;
          status: Database["public"]["Enums"]["character_status"];
          updated_at: string;
          version: number;
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        SetofOptions: {
          from: "*";
          to: "characters";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      save_character_humanity: {
        Args: {
          p_character_id: string;
          p_convictions: Json;
          p_expected_version: number;
          p_touchstones: Json;
        };
        Returns: {
          chronicle_id: string;
          clan_id: string | null;
          created_at: string;
          creation_step: number;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token: string | null;
          ruleset_version: string;
          sect: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset: string | null;
          slot_number: number | null;
          slug: string | null;
          status: Database["public"]["Enums"]["character_status"];
          updated_at: string;
          version: number;
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        SetofOptions: {
          from: "*";
          to: "characters";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      save_character_identity: {
        Args: {
          p_ambition?: string;
          p_apparent_age?: number;
          p_character_id: string;
          p_concept?: string;
          p_desire?: string;
          p_expected_version: number;
          p_name: string;
          p_nationality?: string;
          p_occupation?: string;
          p_social_name?: string;
        };
        Returns: {
          chronicle_id: string;
          clan_id: string | null;
          created_at: string;
          creation_step: number;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token: string | null;
          ruleset_version: string;
          sect: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset: string | null;
          slot_number: number | null;
          slug: string | null;
          status: Database["public"]["Enums"]["character_status"];
          updated_at: string;
          version: number;
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        SetofOptions: {
          from: "*";
          to: "characters";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      save_character_lineage: {
        Args: {
          p_character_id: string;
          p_clan_id?: string;
          p_embrace_date?: string;
          p_expected_version: number;
          p_lineage: Database["public"]["Enums"]["character_lineage"];
          p_sect?: Database["public"]["Enums"]["character_sect"];
          p_sire_name?: string;
        };
        Returns: {
          chronicle_id: string;
          clan_id: string | null;
          created_at: string;
          creation_step: number;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token: string | null;
          ruleset_version: string;
          sect: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset: string | null;
          slot_number: number | null;
          slug: string | null;
          status: Database["public"]["Enums"]["character_status"];
          updated_at: string;
          version: number;
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        SetofOptions: {
          from: "*";
          to: "characters";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      save_character_skills: {
        Args: {
          p_character_id: string;
          p_expected_version: number;
          p_skill_preset: string;
          p_skills: Json;
          p_specializations: Json;
        };
        Returns: {
          chronicle_id: string;
          clan_id: string | null;
          created_at: string;
          creation_step: number;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token: string | null;
          ruleset_version: string;
          sect: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset: string | null;
          slot_number: number | null;
          slug: string | null;
          status: Database["public"]["Enums"]["character_status"];
          updated_at: string;
          version: number;
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        SetofOptions: {
          from: "*";
          to: "characters";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      save_character_story: {
        Args: {
          p_after_embrace?: string;
          p_appearance?: string;
          p_character_id: string;
          p_embrace_account?: string;
          p_expected_version: number;
          p_haven_notes?: string;
          p_human_history?: string;
          p_personality?: string;
          p_possessions?: string;
          p_private_notes?: string;
          p_relationships?: string;
        };
        Returns: {
          chronicle_id: string;
          clan_id: string | null;
          created_at: string;
          creation_step: number;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token: string | null;
          ruleset_version: string;
          sect: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset: string | null;
          slot_number: number | null;
          slug: string | null;
          status: Database["public"]["Enums"]["character_status"];
          updated_at: string;
          version: number;
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        SetofOptions: {
          from: "*";
          to: "characters";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      submit_character_for_review: {
        Args: { p_character_id: string };
        Returns: {
          chronicle_id: string;
          clan_id: string | null;
          created_at: string;
          creation_step: number;
          id: string;
          lineage: Database["public"]["Enums"]["character_lineage"];
          name: string;
          owner_id: string;
          public_share_token: string | null;
          ruleset_version: string;
          sect: Database["public"]["Enums"]["character_sect"] | null;
          skill_preset: string | null;
          slot_number: number | null;
          slug: string | null;
          status: Database["public"]["Enums"]["character_status"];
          updated_at: string;
          version: number;
          visibility: Database["public"]["Enums"]["character_visibility"];
        };
        SetofOptions: {
          from: "*";
          to: "characters";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
    };
    Enums: {
      character_advantage_source: "base_budget" | "predator_type" | "xp";
      character_discipline_source: "clan" | "out_of_clan" | "caitiff" | "thin_blood";
      character_lineage: "clan" | "caitiff" | "thin_blood";
      character_revision_reason: "creation_approved" | "xp_applied" | "narrator_edit";
      character_sect: "camarilla" | "anarch" | "sabbat" | "ashirra" | "independent";
      character_status:
        | "draft"
        | "submitted"
        | "changes_requested"
        | "approved"
        | "published"
        | "archived";
      character_visibility: "private" | "unlisted" | "public";
      chronicle_role: "player" | "storyteller" | "admin";
      media_kind: "portrait" | "avatar" | "other";
      reference_advantage_kind: "merit" | "flaw" | "background";
      reference_verification_status: "verified_from_source" | "requires_reference";
      review_event_action: "submitted" | "approved" | "changes_requested" | "published";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      character_advantage_source: ["base_budget", "predator_type", "xp"],
      character_discipline_source: ["clan", "out_of_clan", "caitiff", "thin_blood"],
      character_lineage: ["clan", "caitiff", "thin_blood"],
      character_revision_reason: ["creation_approved", "xp_applied", "narrator_edit"],
      character_sect: ["camarilla", "anarch", "sabbat", "ashirra", "independent"],
      character_status: [
        "draft",
        "submitted",
        "changes_requested",
        "approved",
        "published",
        "archived",
      ],
      character_visibility: ["private", "unlisted", "public"],
      chronicle_role: ["player", "storyteller", "admin"],
      media_kind: ["portrait", "avatar", "other"],
      reference_advantage_kind: ["merit", "flaw", "background"],
      reference_verification_status: ["verified_from_source", "requires_reference"],
      review_event_action: ["submitted", "approved", "changes_requested", "published"],
    },
  },
} as const;
