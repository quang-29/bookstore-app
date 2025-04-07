import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, X } from 'lucide-react-native';
import colors from '../constants/colors';



export default function SearchBar({ autoFocus = false }) {
//   const router = useRouter();
// //   const { searchBooks, searchQuery, resetSearch } = useBookStore();
  const [query, setQuery] = useState("");
  
  const handleSearch = () => {
    // if (query.trim()) {
    //   searchBooks(query);
    //   router.push('/search');
    // }
  };
  
  const handleClear = () => {
    // setQuery('');
    // resetSearch();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.gray[400]} style={styles.searchIcon} />
        
        <TextInput
          style={styles.input}
          placeholder="Search books, authors..."
          placeholderTextColor={colors.gray[400]}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoFocus={autoFocus}
        />
        
        {query.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <X size={18} color={colors.gray[400]} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
});