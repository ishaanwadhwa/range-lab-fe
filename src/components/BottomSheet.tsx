/**
 * BottomSheet - Custom bottom sheet using RN Animated API
 * Compatible with Expo Go (no reanimated dependency)
 * "Dark Confidence" design
 */

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  PanResponder,
  ScrollView,
  Platform,
} from "react-native";
import { colors } from "../theme/colors";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.85;
const SHEET_MIN_HEIGHT = SCREEN_HEIGHT * 0.5;

export interface BottomSheetRef {
  open: () => void;
  close: () => void;
  snapToIndex: (index: number) => void;
}

interface BottomSheetProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ children, onClose }, ref) => {
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const isOpen = useRef(false);
    const currentHeight = useRef(SHEET_MIN_HEIGHT);

    // Pan responder for drag-to-dismiss
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Only respond to vertical swipes
          return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
        },
        onPanResponderMove: (_, gestureState) => {
          if (gestureState.dy > 0) {
            // Only allow dragging down
            translateY.setValue(SCREEN_HEIGHT - currentHeight.current + gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 100 || gestureState.vy > 0.5) {
            // Close if dragged down enough or fast enough
            close();
          } else {
            // Snap back
            Animated.spring(translateY, {
              toValue: SCREEN_HEIGHT - currentHeight.current,
              useNativeDriver: true,
              friction: 8,
            }).start();
          }
        },
      })
    ).current;

    const open = () => {
      isOpen.current = true;
      currentHeight.current = SHEET_MIN_HEIGHT;
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT - SHEET_MIN_HEIGHT,
          useNativeDriver: true,
          friction: 8,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const close = () => {
      isOpen.current = false;
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: SCREEN_HEIGHT,
          useNativeDriver: true,
          friction: 8,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onClose?.();
      });
    };

    const snapToIndex = (index: number) => {
      const heights = [SHEET_MIN_HEIGHT, SHEET_MAX_HEIGHT];
      const targetHeight = heights[index] || SHEET_MIN_HEIGHT;
      currentHeight.current = targetHeight;

      if (!isOpen.current) {
        isOpen.current = true;
        backdropOpacity.setValue(0);
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }

      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT - targetHeight,
        useNativeDriver: true,
        friction: 8,
      }).start();
    };

    useImperativeHandle(ref, () => ({
      open,
      close,
      snapToIndex,
    }));

    return (
      <>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
              pointerEvents: isOpen.current ? "auto" : "none",
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={close}>
            <View style={styles.backdropTouchable} />
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Sheet */}
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY }],
              height: SHEET_MAX_HEIGHT,
            },
          ]}
        >
          {/* Handle */}
          <View {...panResponder.panHandlers} style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </>
    );
  }
);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 100,
  },
  backdropTouchable: {
    flex: 1,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 101,
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 20,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
  },
});

