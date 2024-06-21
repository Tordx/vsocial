import {
  View,
  Text,
  Modal,
  Image,
  PanResponder,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {globalContainers} from '../../../../styles';
import {CombinedData, postlist, userdetails} from '../../../../interface';
import {theme, white} from '../../../../assets/colors';
import TimeAgo from 'react-native-timeago';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
type Props = {
  visible: boolean;
  data: CombinedData | undefined;
  onRequestClose: () => void;
};

const PostDetails = (props: Props) => {
  const post = props?.data?.postData as postlist;
  const user = props?.data?.userData as userdetails;

  const [seemore, setseemore] = useState<boolean>(false);
  const [imageonly, setimageonly] = useState<boolean>(true);
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setimageonly(false);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 50) {
          props.onRequestClose();
        } else if (gestureState.dx < -50) {
          props.onRequestClose();
        } else if (gestureState.dy < -50) {
          props.onRequestClose();
        } else if (gestureState.dy > 50) {
          props.onRequestClose();
        }
      },
      onPanResponderRelease: () => {
        setimageonly(true);
      },
    }),
  ).current;
  return (
    <Modal
      onRequestClose={props.onRequestClose}
      transparent
      animationType="fade"
      visible={props.visible}>
      <View
        style={[globalContainers.container, {backgroundColor: theme.accenta}]}>
        <Image
          source={{uri: post?.photo}}
          style={{width: '100%', height: '100%'}}
          resizeMode="contain"
          {...panResponder.panHandlers}
        />
        {imageonly && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              backgroundColor: '#00000099',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <View style={{padding: 15}}>
              <Text
                style={{
                  color: white.W001,
                  fontSize: 12,
                  marginTop: 10,
                  fontFamily: 'Montserrat-Bold',
                }}>
                {user?.fullname.firstname} {user?.fullname.lastname}
              </Text>
              <TimeAgo
                time={post?.timestamp}
                textStyle={{
                  color: white.W001,
                  fontSize: 8,
                  marginTop: 2,
                  fontFamily: 'Montserrat-Regular',
                }}
              />
              <Text
                style={{
                  color: white.W001,
                  fontSize: 12,
                  marginTop: 10,
                  fontFamily: 'Montserrat-Regular',
                }}>
                {post?.description.length < 50
                  ? post?.description
                  : seemore
                  ? post?.description
                  : post?.description.slice(0, 45)}
                {post?.description.length > 50 && (
                  <Text
                    onPress={() => setseemore(!seemore)}
                    style={{
                      color: white.W001,
                      fontSize: 12,
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    {seemore ? '  see less' : '  see more'}
                  </Text>
                )}
              </Text>
            </View>
          </View>
        )}
      </View>
      <Pressable
        onPress={props.onRequestClose}
        style={{position: 'absolute', top: 10, right: 10}}>
        <Icon name="close" size={20} color={white.W001} />
      </Pressable>
    </Modal>
  );
};

export default PostDetails;
