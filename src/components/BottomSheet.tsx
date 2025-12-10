/**
 * BottomSheet - Custom bottom sheet using RN Animated API
 * Compatible with Expo Go (no reanimated dependency)
 * "Dark Confidence" design
 */

import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";
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
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.93;
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
    const [isOpen, setIsOpen] = useState(false);
    const currentHeight = useRef(SHEET_MIN_HEIGHT);

    const handlePanResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return Math.abs(gestureState.dy) > 5;
        },
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponderCapture: () => false,
        onPanResponderMove: (_, gestureState) => {
          const newTranslateY = SCREEN_HEIGHT - currentHeight.current + gestureState.dy;
          const minY = SCREEN_HEIGHT - SHEET_MAX_HEIGHT;
          const maxY = SCREEN_HEIGHT - SHEET_MIN_HEIGHT;

          if (newTranslateY >= minY && newTranslateY <= maxY) {
            translateY.setValue(newTranslateY);
          } else if (newTranslateY < minY) {
            const resistance = 0.3;
            translateY.setValue(minY + (newTranslateY - minY) * resistance);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          const dragDistance = gestureState.dy;
          const dragVelocity = gestureState.vy;

          if (dragDistance > 100 || dragVelocity > 0.5) {
            if (currentHeight.current === SHEET_MIN_HEIGHT) {
              close();
            } else {
              currentHeight.current = SHEET_MIN_HEIGHT;
              Animated.spring(translateY, {
                toValue: SCREEN_HEIGHT - SHEET_MIN_HEIGHT,
                useNativeDriver: true,
                friction: 8,
              }).start();
            }
          } else if (dragDistance < -50 || dragVelocity < -0.5) {
            currentHeight.current = SHEET_MAX_HEIGHT;
            Animated.spring(translateY, {
              toValue: SCREEN_HEIGHT - SHEET_MAX_HEIGHT,
              useNativeDriver: true,
              friction: 8,
            }).start();
          } else {
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
      setIsOpen(true);
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
        setIsOpen(false);
        onClose?.();
      });
    };

    const snapToIndex = (index: number) => {
      const heights = [SHEET_MIN_HEIGHT, SHEET_MAX_HEIGHT];
      const targetHeight = heights[index] || SHEET_MIN_HEIGHT;
      currentHeight.current = targetHeight;

      if (!isOpen) {
        setIsOpen(true);
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

    if (!isOpen) {
      return null;
    }

    return (
      <>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
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
          <View {...handlePanResponder.panHandlers} style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
            bounces={true}
            overScrollMode="never"
            keyboardShouldPersistTaps="handled"
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
  contentWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: Platform.OS === "ios" ? 50 : 30,
  },
});