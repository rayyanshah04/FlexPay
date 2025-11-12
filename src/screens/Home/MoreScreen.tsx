import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import Icon from '@react-native-vector-icons/ionicons';
import { colors } from '../../theme/style';

// for name and also see line 63
import React from 'react';
import { Text } from 'react-native';
import { useUserName } from '../../hooks/useUserName';


import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/StackNavigator';

const infoItems = [
  { icon: 'shield-checkmark-outline', text: 'Privacy policy' },
  { icon: 'document-text-outline', text: 'Terms & conditions' },
  { icon: 'calendar-outline', text: 'Schedule of charges' },
];


type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AppTabs'
>;

const MoreScreen = () => {
  const userName = useUserName();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch();
  const mainItems = [
    {
      icon: 'help-circle-outline',
      iconType: 'ionicon',
      text: 'Help center',
    },
    {
      sectionHeader: 'Info',
      isSection: true,
    },
    {
      isCard: true,
      items: infoItems,
    },
    {
      icon: 'phone-portrait-outline',
      iconType: 'ionicon',
      text: 'Manage devices',
      showChevron: true,
    },
    {
      icon: 'business-outline',
      iconType: 'ionicon',
      text: 'Raast ID Management',
      showChevron: true,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.item}>
        <View style={[styles.iconContainer, styles.userContainer]}>
          <FontAwesome name={'user'} size={30} color={colors.primary} />
        </View>
        <Text style={styles.itemText}>{userName}</Text>
      </TouchableOpacity>
      {mainItems.map((item, index) => {
        // Section header
        if (item.isSection)
          return (
            <Text key={index} style={styles.sectionHeader}>
              {item.sectionHeader}
            </Text>
          );

        // Card with multiple rows
        if (item.isCard)
          return (
            <View key={index} style={styles.card}>
              {item.items.map((cardItem, cardIndex) => (
                <TouchableOpacity key={cardIndex} style={styles.row}>
                  <View style={styles.iconContainer}>
                    <Icon
                      name={cardItem.icon as any}
                      size={22}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.itemText}>{cardItem.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          );

        // Default item
        return (
          <TouchableOpacity key={index} style={styles.item}>
            <View style={styles.iconContainer}>
              <Icon name={item.icon as any} size={22} color={colors.error} />
            </View>
            <Text style={styles.itemText}>{item.text}</Text>
            {item.showChevron && (
              <Icon
                name="chevron-forward-outline"
                size={20}
                color={colors.placeholder}
                style={{ marginLeft: 'auto' }}
              />
            )}
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          dispatch(logout());
          navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
          });
        }}
      >
        <View style={styles.iconContainer}>
          <Icon name={'log-out-outline'} size={22} color={colors.error} />
        </View>
        <Text style={styles.itemText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeader: {
    fontSize: 14,
    color: colors.placeholder,
    marginVertical: 10,
    fontWeight: '500',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 4,
    marginBottom: 16,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.frostedBorder,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  iconContainer: {
    backgroundColor: `rgba(${colors.primary}, 0.1)`,
    padding: 8,
    borderRadius: 25,
    marginRight: 12,
  },

  userContainer: {
    backgroundColor: `rgba(${colors.accent}, 0.1)`,
  },
  itemText: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '500',
  },
});

export default MoreScreen;
