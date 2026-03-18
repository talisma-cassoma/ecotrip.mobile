FROM ubuntu:jammy

# -----------------------------
# Java
# -----------------------------
ENV JAVA_HOME /usr/lib/jvm/java-17-openjdk-amd64
ENV PATH $PATH:$JAVA_HOME/bin

# Install base packages
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    curl \
    build-essential \
    openjdk-17-jdk \
    software-properties-common \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# Git
# -----------------------------
RUN add-apt-repository ppa:git-core/ppa
RUN apt-get update && apt-get install -y git

# -----------------------------
# Node.js 20 (igual à CI)
# Instala Node 20 LTS
RUN wget https://nodejs.org/dist/v20.11.1/node-v20.11.1-linux-x64.tar.xz \
    && tar -xJf node-v20.11.1-linux-x64.tar.xz -C /usr/local --strip-components=1 \
    && rm node-v20.11.1-linux-x64.tar.xz

# Habilita Corepack (Yarn)
RUN corepack enable
RUN corepack prepare yarn@1.22.21 --activate

# -----------------------------
# Clean caches
# -----------------------------
RUN rm -rf /root/.npm \
    && rm -rf /root/.cache

# -----------------------------
# Node tools
# -----------------------------
RUN npm install -g npm@10.5.0 \
    && npm install -g pnpm@9.3.0 node-gyp@10.1.0

# Install Yarn via corepack
RUN corepack prepare yarn@1.22.21 --activate

# Install EAS CLI
RUN yarn global add eas-cli@latest

# Verify versions (debug)
RUN node -v
RUN yarn -v
RUN which eas
RUN eas --version

ENV PATH="$PATH:$(yarn global bin)"

# -----------------------------
# Bun
# -----------------------------
ENV BUN_INSTALL /usr/local
RUN wget -qO- https://bun.sh/install | bash -s "bun-v1.1.13"

# -----------------------------
# Android NDK
# -----------------------------
RUN wget https://dl.google.com/android/repository/android-ndk-r26b-linux.zip \
    && unzip android-ndk-r26b-linux.zip -d /opt \
    && rm android-ndk-r26b-linux.zip

ENV NDK_HOME /opt/android-ndk-r26b

# -----------------------------
# Android SDK
# -----------------------------
RUN wget https://dl.google.com/android/repository/commandlinetools-linux-7583922_latest.zip \
    && mkdir -p /opt/android-sdk/cmdline-tools \
    && unzip commandlinetools-linux-7583922_latest.zip -d /opt/android-sdk/cmdline-tools \
    && mv /opt/android-sdk/cmdline-tools/cmdline-tools /opt/android-sdk/cmdline-tools/latest \
    && rm commandlinetools-linux-7583922_latest.zip

ENV ANDROID_HOME /opt/android-sdk
ENV PATH $PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Install Android SDK components
RUN yes | sdkmanager --licenses \
    && sdkmanager \
        "platform-tools" \
        "platforms;android-33" \
        "build-tools;33.0.0"

# -----------------------------
# Default command
# -----------------------------
CMD ["bash", "-c", "yarn install --frozen-lockfile --ignore-engines && eas build --platform android --local --profile ${PROFILE:-development}"]