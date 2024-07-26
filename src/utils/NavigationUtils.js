// example
// const navigation = useNavigation();
//   useEffect(() => {
//     hideTabBarAndHeader(navigation);
//     return () => {
//       showTabBarAndHeader(navigation);
//     };
//   }, [navigation]);
//
// it can hide the tab navigation header and bottom bar suitable for
// the page like events details

export const hideTabBarAndHeader = navigation => {
  const parentNavigation = navigation.getParent();
  if (navigation.canGoBack() && parentNavigation) {
    parentNavigation.setOptions({
      tabBarStyle: {display: 'none'},
      headerShown: false,
    });
  }
};

export const showTabBarAndHeader = navigation => {
  const parentNavigation = navigation.getParent();
  if (parentNavigation) {
    parentNavigation.setOptions({
      tabBarStyle: undefined,
      headerShown: true,
    });
  }
};
