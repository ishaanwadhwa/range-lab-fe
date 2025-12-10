/**
 * ExplanationSheet - Bottom sheet with spot explanation
 * "Dark Confidence" design
 */

import React, { forwardRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { BottomSheet, BottomSheetRef } from "./BottomSheet";
import { colors } from "../theme/colors";
import { SpotMeta } from "../types/spot";

interface ExplanationSheetProps {
  meta?: SpotMeta;
  tags?: string[];
  isCorrect: boolean;
  selectedAction: string;
  correctAction: string;
  onAskQuestion: () => void;
  onClose: () => void;
}

export const ExplanationSheet = forwardRef<BottomSheetRef, ExplanationSheetProps>(
  ({ meta, tags, isCorrect, selectedAction, correctAction, onAskQuestion, onClose }, ref) => {
    const hasMeta = meta && (meta.summary || (meta.solverNotes && meta.solverNotes.length > 0));
    const allTags = [...(meta?.concept || []), ...(tags || [])];

    return (
      <BottomSheet ref={ref} onClose={onClose}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerLabel}>EXPLANATION</Text>
            <Text style={styles.headerTitle}>Why this decision?</Text>
          </View>

          {/* Result recap */}
          <View style={[styles.resultCard, isCorrect ? styles.resultCorrect : styles.resultWrong]}>
            <Text style={styles.resultIcon}>{isCorrect ? "✓" : "✗"}</Text>
            <View style={styles.resultContent}>
              <Text style={styles.resultTitle}>
                {isCorrect ? "You chose correctly" : "Solver prefers different"}
              </Text>
              <Text style={styles.resultSubtitle}>
                {isCorrect
                  ? `${selectedAction} is the optimal play`
                  : `You: ${selectedAction} → Best: ${correctAction}`}
              </Text>
            </View>
          </View>

          {/* Explanation content */}
          {hasMeta ? (
            <>
              {/* Summary */}
              {meta.summary && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>SUMMARY</Text>
                  <Text style={styles.summaryText}>{meta.summary}</Text>
                </View>
              )}

              {/* Solver notes */}
              {meta.solverNotes && meta.solverNotes.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>KEY POINTS</Text>
                  <View style={styles.notesList}>
                    {meta.solverNotes.map((note, idx) => (
                      <View key={idx} style={styles.noteRow}>
                        <View style={styles.noteBullet} />
                        <Text style={styles.noteText}>{note}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Frequencies */}
              {meta.freq && meta.freq.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>SOLVER FREQUENCIES</Text>
                  <View style={styles.freqRow}>
                    {meta.freq.map((f, idx) => (
                      <View key={idx} style={styles.freqItem}>
                        <Text style={styles.freqValue}>{Math.round(f * 100)}%</Text>
                        <Text style={styles.freqLabel}>Option {idx + 1}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Tags */}
              {allTags.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>CONCEPTS</Text>
                  <View style={styles.tagsRow}>
                    {allTags.map((tag, idx) => (
                      <View key={idx} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          ) : (
            <View style={styles.noMetaContainer}>
              <Text style={styles.noMetaIcon}>📚</Text>
              <Text style={styles.noMetaText}>
                Explanation unavailable for this spot.
              </Text>
              <Text style={styles.noMetaSubtext}>
                Try asking a question for more insights.
              </Text>
            </View>
          )}

          {/* CTA */}
          <View style={styles.ctaSection}>
            <Pressable style={styles.askButton} onPress={onAskQuestion}>
              <Text style={styles.askButtonIcon}>💬</Text>
              <Text style={styles.askButtonText}>ASK A QUESTION</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
  },

  // Header
  header: {
    marginBottom: 20,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.textPrimary,
  },

  // Result card
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 24,
    gap: 14,
  },
  resultCorrect: {
    backgroundColor: colors.greenDim,
    borderColor: colors.green,
  },
  resultWrong: {
    backgroundColor: colors.redDim,
    borderColor: colors.red,
  },
  resultIcon: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  resultSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: 2,
    marginBottom: 10,
  },

  // Summary
  summaryText: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
  },

  // Notes
  notesList: {
    gap: 12,
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  noteBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.gold,
    marginTop: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  // Frequencies
  freqRow: {
    flexDirection: "row",
    gap: 12,
  },
  freqItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  freqValue: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textPrimary,
  },
  freqLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },

  // Tags
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: colors.goldDim,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.gold,
  },

  // No meta fallback
  noMetaContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noMetaIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noMetaText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
    textAlign: "center",
  },
  noMetaSubtext: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 8,
  },

  // CTA
  ctaSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  askButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gold,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  askButtonIcon: {
    fontSize: 18,
  },
  askButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#000",
    letterSpacing: 1,
  },
});
