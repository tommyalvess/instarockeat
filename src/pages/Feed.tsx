/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import io from 'socket.io-client';

import camera from '../assets/camera.png';
import comment from '../assets/comment.png';
import like from '../assets/like.png';
import more from '../assets/more.png';
import send from '../assets/send.png';

import api from '../services/api';
import { URL } from '../utils/utils';

interface FeedInfo {
  _id: number,
  author: string
  place: string,
  description: string,
  hashtags: string,
  likes: number,
  createdAt: string,
  updatedAt: string,
  image: string,
  __v: number
}

export function Feed() {

  const navigation = useNavigation();
  const [feed,setFeed] = useState([]);

  navigation.setOptions({
    headerRight: () =>
    (
      <TouchableOpacity onPress={ () => navigation.navigate('New')}>
        <Image source={camera} />
      </TouchableOpacity>
    ),
  });

  async function fetchData() {
    const response = await api.get('posts');
    setFeed(response.data);
  }

  function renderItems(item: FeedInfo) {
    return (
      <View style={styles.feedItem}>

        <View style={styles.feedItemHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.name}>{item.author}</Text>
            <Text style={styles.place}>{item.place}</Text>
          </View>
          <Image source={more} />
        </View>

        <Image style={styles.feedImage} source={{ uri: URL.concat(`/files/${item.image}`)}}/>

        <View style={styles.feedItemFooter}>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.action} onPress={ () => handleLike(item._id)}>
              <Image source={like} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.action} onPress={ () => {}}>
              <Image source={comment} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.action} onPress={ () => {}}>
              <Image source={send} />
            </TouchableOpacity>
          </View>
          <Text style={styles.likes}>{item.likes} curtidas</Text>
          <Text style={styles.desc}>{item.description}</Text>
          <Text style={styles.hashtags}>{item.hashtags}</Text>
        </View>

      </View>
    );
  }

  function registerToSocket() {
    const socket = io(URL);

    socket.on('post', newPost => {
      setFeed(prevFeed => [newPost, ...prevFeed]);
    });

    socket.on('like', likedPost => {
      setFeed(prevFeed =>
        prevFeed.map(post =>
          post._id === likedPost._id ? likedPost : post
        )
      );
    });

  }

  async function handleLike(id:string) {
    await api.post(`/post/${id}/like`);
  }
  useEffect(() => {
    fetchData();
    registerToSocket();
  },[]);

  return (
    <View style={styles.container}>
        <FlatList
          data={feed}
          keyExtractor={post => post._id}
          renderItem={ ({item}) => renderItems(item)}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  feedItem: {
    marginTop: 20,
  },
  feedItemHeader: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 14,
    color: '#000',
  },
  place: {
    fontSize: 12,
    color: '#666',
  },
  feedImage: {
    width: '100%',
    height: 400,
    marginVertical: 15,
  },
  feedItemFooter: {
    paddingHorizontal: 15,
  },
  actions: {
    flexDirection: 'row',
  },
  action: {
    marginRight: 8,
  },
  likes: {
    marginTop: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  desc: {
    lineHeight: 18,
    color: '#000',
  },
  hashtags: {
    color: '#7159c1',
  },
});


