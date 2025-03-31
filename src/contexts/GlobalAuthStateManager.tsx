/**
 * AuthContext: The Authentication State Manager
 * ------------------------------------------
 * Think of this as the security checkpoint that:
 *
 * - Manages Authentication State:
 *   • Tracks current user session
 *   • Handles loading states during auth checks
 *   • Maintains real-time auth status
 *
 * - Provides Global Auth Access:
 *   • Makes user info available throughout the app
 *   • Handles auth state synchronization
 *   • Manages auth status subscriptions
 */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {User} from '@supabase/supabase-js'