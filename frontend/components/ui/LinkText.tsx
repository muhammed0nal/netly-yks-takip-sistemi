import { Pressable, StyleSheet, Text } from 'react-native';

import Colors from '@/constants/Colors';
import { typography } from '@/constants/Theme';

type LinkTextProps = {
  text: string;
  linkText: string;
  onPress: () => void;
};

export default function LinkText({ text, linkText, onPress }: LinkTextProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.container}>
      <Text style={styles.text}>
        {text}{' '}
        <Text style={styles.link}>{linkText}</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    ...typography.caption,
    color: Colors.dark.textSecondary,
  },
  link: {
    color: Colors.dark.blue400,
    fontWeight: '600',
  },
});
