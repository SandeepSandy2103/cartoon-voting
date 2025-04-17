import streamlit as st
import requests

# Backend URL
BACKEND_URL = "http://localhost:8081"

# Set page configuration
st.set_page_config(page_title="Cartoon Voting App", layout="centered")
st.title("🎨 Vote for Your Favorite Cartoon!")

# Function to fetch cartoons
@st.cache_data(ttl=60)
def get_cartoons():
    try:
        res = requests.get(f"{BACKEND_URL}/cartoons")
        res.raise_for_status()
        return res.json()
    except requests.exceptions.RequestException:
        st.error("❌ Failed to fetch cartoons. Please ensure the backend is running.")
        return []

# Function to send a vote
def vote_cartoon(cartoon_id):
    try:
        res = requests.post(f"{BACKEND_URL}/vote", json={"id": cartoon_id})
        res.raise_for_status()
    except requests.exceptions.RequestException:
        st.error("❌ Failed to submit your vote. Please try again later.")

# Function to fetch results
@st.cache_data(ttl=5)
def get_results():
    try:
        res = requests.get(f"{BACKEND_URL}/results")
        res.raise_for_status()
        return res.json()
    except requests.exceptions.RequestException:
        st.error("❌ Failed to fetch results. Please ensure the backend is running.")
        return []

# Display cartoons
cartoons = get_cartoons()

if cartoons:
    cols = st.columns(len(cartoons))
    for idx, cartoon in enumerate(cartoons):
        with cols[idx]:
            # Display the cartoon image
            st.image(cartoon['image_url'], caption=cartoon['name'], use_column_width=True)
            if st.button(f"Vote for {cartoon['name']}", key=cartoon['id']):
                vote_cartoon(cartoon['id'])
                st.success(f"✅ Thanks for voting for {cartoon['name']}!")
else:
    st.warning("⚠️ No cartoons available to vote for.")

# Divider
st.markdown("---")

# Display voting results
st.subheader("📊 Live Results")
results = get_results()

if results:
    for result in results:
        st.text(f"{result['name']}: {result['percentage']}%")
        st.progress(float(result['percentage']) / 100)
else:
    st.warning("⚠️ No results available.") 