/* eslint-disable prettier/prettier */
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';

import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../services/api';

export function New() {
  const navigation = useNavigation();

  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [author, setAuthor] = useState('');
  const [place, setPlace] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [permission, setPermission] = useState(false);

  navigation.setOptions({
    headerTitle: 'Nova publicação',
  });

  const handleSelectImage = () => {

    launchImageLibrary( {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 2000,
      maxWidth: 2000,
    }, async (response) => {
      if (response.errorCode) {
        console.log(response.errorCode);
      } else if (response.didCancel) {
        console.log('User canceled');
      } else {
        let uri = response.assets?.[0]?.base64;

        const preview = {
          uri: `data:image/jpeg;base64,${uri}`,
        };

        let prefix;
        let ext;

        if (response.assets?.[0]?.fileName) {
          [prefix, ext] = response.assets?.[0]?.fileName.split('.');
          ext = ext.toLowerCase() === 'heic' ? 'jpg' : ext;
        } else {
          prefix = new Date().getTime();
          ext = 'jpg';
        }

        const image = {
          uri: response.assets?.[0]?.uri,
          type: response.assets?.[0]?.type,
          name: `${prefix}.${ext}`,
        };

        setPreview(preview);
        setImage(image);
      }
    });
  };

  const handleSubmit = async () => {
    const data = new FormData();

    data.append('image', image);
    data.append('author', author);
    data.append('place', place);
    data.append('description', description);
    data.append('hashtags', hashtags);

    await api.post('/post', data);

    navigation.navigate('Feed');
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={handleSelectImage}>
          <Text style={styles.selectButtonText}>Selecionar imagem</Text>
        </TouchableOpacity>

        {preview && (
          <Image style={styles.preview} source={preview} />
        )}

        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Nome do autor"
          placeholderTextColor="#999"
          value={author}
          onChangeText={setAuthor}
        />
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Local da foto"
          placeholderTextColor="#999"
          value={place}
          onChangeText={setPlace}
        />
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Descrição"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Hashtags"
          placeholderTextColor="#999"
          value={hashtags}
          onChangeText={setHashtags}
        />

        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleSubmit}>
          <Text style={styles.shareButtonText}>Compartilhar</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  selectButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    height: 42,

    justifyContent: 'center',
    alignItems: 'center',
  },

  selectButtonText: {
    fontSize: 16,
    color: '#666',
  },

  preview: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 4,
  },

  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginTop: 10,
    fontSize: 16,
  },

  shareButton: {
    backgroundColor: '#7159c1',
    borderRadius: 4,
    height: 42,
    marginTop: 15,

    justifyContent: 'center',
    alignItems: 'center',
  },

  shareButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
});

