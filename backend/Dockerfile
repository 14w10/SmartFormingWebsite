# FROM ruby:3.3.5-slim-bookworm

# RUN apt-get update -qq && apt-get install --no-install-recommends -y \
#     build-essential \
#     patch \
#     ruby-dev \
#     zlib1g-dev \
#     liblzma-dev \
#     libxml2 \
#     libxml2-dev \
#     libpq-dev \
#     default-libmysqlclient-dev \
#     imagemagick \
#     git \
#     wget \
#     gnupg2 \
#     curl \
#     automake \
#     libtool \
#     gtk-doc-tools \
#     gobject-introspection \
#     libglib2.0-dev \
#     liborc-0.4-dev \
#     libexpat1-dev \
#     libmagickwand-dev \
#     libvips42 \
#     && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
#     && echo "deb http://apt.postgresql.org/pub/repos/apt/ bookworm"-pgdg main | tee  /etc/apt/sources.list.d/pgdg.list \
#     && apt-get update -qq && apt-get install --no-install-recommends --no-upgrade -y \
# #    postgresql-11 \
#     postgresql-client-11 \
#     && rm -rf /var/lib/apt/lists/*


# # RUN cd && git clone --branch v8.9.2 https://github.com/libvips/libvips.git \
# #     && cd libvips && ./autogen.sh && make \
# #     && make install \
# #     && apt-get remove -y automake \
# #     && apt-get autoremove -y  \
# #     && apt-get autoclean  \
# #     && apt-get clean  \
# #     && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*



# RUN mkdir /opt/app
# WORKDIR /opt/app

# RUN gem install bundler -v 2.0.2

# ADD Gemfile* /opt/app/
# RUN ls /opt/app/

# RUN bundle install

# COPY . /opt/app

# EXPOSE 3000

# # RUN $BUNDLE_PATH/bin/rails --version
# RUN ./bin/rails --version

FROM ruby:2.5.5-slim-stretch

RUN apt-get update -qq && apt-get install --no-install-recommends -y \
    build-essential \
    patch \
    ruby-dev \
    zlib1g-dev \
    liblzma-dev \
    libxml2 \
    libxml2-dev \
    libpq-dev \
    default-libmysqlclient-dev \
    imagemagick \
    git \
    wget \
    gnupg2 \
    curl \
    automake \
    libtool \
    gtk-doc-tools \
    gobject-introspection \
    libglib2.0-dev \
    liborc-0.4-dev \
    libexpat1-dev \
    libmagickwand-dev \
    && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && echo "deb http://apt.postgresql.org/pub/repos/apt/ stretch"-pgdg main | tee  /etc/apt/sources.list.d/pgdg.list \
    && apt-get update -qq && apt-get install --no-install-recommends --no-upgrade -y \
#    postgresql-11 \
    postgresql-client-11 \
    && rm -rf /var/lib/apt/lists/*


RUN cd && git clone --branch v8.9.2 https://github.com/libvips/libvips.git \
    && cd libvips && ./autogen.sh && make \
    && make install \
    && apt-get remove -y automake \
    && apt-get autoremove -y  \
    && apt-get autoclean  \
    && apt-get clean  \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*



RUN mkdir /opt/app
WORKDIR /opt/app

RUN gem install bundler -v 2.0.2

ADD Gemfile* /opt/app/
RUN ls /opt/app/

RUN bundle install

COPY . /opt/app

EXPOSE 3000

RUN $BUNDLE_PATH/bin/rails --version
