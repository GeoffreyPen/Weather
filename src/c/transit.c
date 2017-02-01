#include "pebble.h"
#include <time.h>
#include <inttypes.h>

static Window *s_main_window;

static TextLayer *s_stop_layer;
static TextLayer *s_eta_layer;
static TextLayer *s_route_layer;
static TextLayer *s_time_layer;
static BitmapLayer *s_icon_layer;

static GBitmap *s_icon_bitmap = NULL;

static AppSync s_sync;
static uint8_t s_sync_buffer[128];
static char test2[50];
static char test[50];
static char test3[50];
static char test4[50];
static int eta=0;
//static struct tm s_last_time;
static struct tm s_time;
char *asctime(const struct tm *clock);
  //time_t ttt = time(NULL);
    //struct tm *time_now = localtime(&ttt);
static char label[12];

enum TRANSITKey {
  TRANSIT_ICON_KEY = 0x0,         // TUPLE_INT
  TRANSIT_STOP_KEY = 0x1,  // TUPLE_CSTRING
  TRANSIT_ETA_KEY = 0x2,         // TUPLE_CSTRING
  TRANSIT_ROUTE_KEY = 0x3        // TUPLE_CSTRING
};

static const uint32_t TRANSIT_ICONS[] = {
  RESOURCE_ID_IMAGE_SUN, // 0
  RESOURCE_ID_IMAGE_CLOUD, // 1
  RESOURCE_ID_IMAGE_RAIN, // 2
  RESOURCE_ID_IMAGE_SNOW // 3
};

static void update_time() {
  // Get a tm structure
  time_t temp = time(NULL);
  struct tm *tick_time = localtime(&temp);
  if(eta>0){
    eta=eta-1;
    snprintf(test4,sizeof(test4),"ETA: %d MINS",eta);
    text_layer_set_text(s_eta_layer,test4);
  }
  // Write the current hours and minutes into a buffer
  static char s_buffer[8];
  strftime(s_buffer, sizeof(s_buffer), clock_is_24h_style() ?
                                          "%H:%M" : "%I:%M", tick_time);

  // Display this time on the TextLayer
  text_layer_set_text(s_time_layer, s_buffer);
}

static void tick_handler(struct tm *tick_time, TimeUnits units_changed) {
update_time();
  
}

static void sync_error_callback(DictionaryResult dict_error, AppMessageResult app_message_error, void *context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, "App Message Sync Error: %d", app_message_error);
}

static void inbox_dropped_callback(AppMessageResult reason, void *context) {
  // A message was received, but had to be dropped
  APP_LOG(APP_LOG_LEVEL_ERROR, "Message dropped. Reason: %d", (int)reason);
}

static void sync_tuple_changed_callback(const uint32_t key, const Tuple* new_tuple, const Tuple* old_tuple, void* context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG,"Hiiii");
  switch (key) {
   
    
    case TRANSIT_ICON_KEY:
    APP_LOG(APP_LOG_LEVEL_DEBUG,"Hi10");
      if (s_icon_bitmap) {
        gbitmap_destroy(s_icon_bitmap);
      }

      s_icon_bitmap = gbitmap_create_with_resource(TRANSIT_ICONS[new_tuple->value->uint8]);
      //bitmap_layer_set_compositing_mode(s_icon_layer, GCompOpSet);
      //bitmap_layer_set_bitmap(s_icon_layer, s_icon_bitmap);
      break;
    
    case TRANSIT_STOP_KEY:
    APP_LOG(APP_LOG_LEVEL_DEBUG,"Hi9");
      // App Sync keeps new_tuple in s_sync_buffer, so we may use it directly
      snprintf(test, sizeof(test),new_tuple->value->cstring);
      //snprintf(test, sizeof(test), "  %d Latitude", (int)new_tuple->value->int32);
    
      text_layer_set_text(s_stop_layer,test);
      //text_layer_set_text(s_stop_layer, new_tuple->value->int32;
      break;

    case TRANSIT_ETA_KEY:
    APP_LOG(APP_LOG_LEVEL_DEBUG,"H11");
    //eta=(int)(new_tuple->value->int32);
    
    //snprintf(test2, sizeof(test2),"%d",(int)(new_tuple->value->int32));
      //text_layer_set_text(s_eta_layer, test2);
          
    snprintf(test2, sizeof(test2),new_tuple->value->cstring);
      
    //eta=1;
    eta=atoi(test2);
    snprintf(test2, sizeof(test2),"ETA: %d MINS",eta);
    if(eta>-1)
      {
      text_layer_set_text(s_eta_layer,test2);
    }
      break;
    
    case TRANSIT_ROUTE_KEY:

      //text_layer_set_text(s_city_layer, new_tuple->value->int32;
          snprintf(test3, sizeof(test3),new_tuple->value->cstring);
      APP_LOG(APP_LOG_LEVEL_DEBUG,test3);
      text_layer_set_text(s_route_layer,test3);
                
      break;
  }
}

static void request_TRANSIT(void) {
  eta=0;
  APP_LOG(APP_LOG_LEVEL_DEBUG,"Hi7");
  DictionaryIterator *iter;
  app_message_outbox_begin(&iter);

  if (!iter) {
    // Error creating outbound message
    return;
  }

  int value = 1;
  dict_write_int(iter, 1, &value, sizeof(int), true);
  dict_write_end(iter);

  app_message_outbox_send();
  APP_LOG(APP_LOG_LEVEL_DEBUG,"Hi8");
}

static void window_load(Window *window) {
     APP_LOG(APP_LOG_LEVEL_DEBUG,"Hi1");
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);

  s_icon_layer = bitmap_layer_create(GRect(0, 10, bounds.size.w, 80));
  layer_add_child(window_layer, bitmap_layer_get_layer(s_icon_layer));


  
  s_stop_layer = text_layer_create(GRect(0, 90, bounds.size.w, 32));
  text_layer_set_text_color(s_stop_layer, GColorBlack);
  text_layer_set_background_color(s_stop_layer, GColorClear);
  text_layer_set_font(s_stop_layer, fonts_get_system_font(FONT_KEY_GOTHIC_28_BOLD));
  text_layer_set_text_alignment(s_stop_layer, GTextAlignmentCenter);
  layer_add_child(window_layer, text_layer_get_layer(s_stop_layer));

  s_eta_layer = text_layer_create(GRect(0, 122, bounds.size.w, 32));
  text_layer_set_text_color(s_eta_layer, GColorBlack);
  text_layer_set_background_color(s_eta_layer, GColorClear);
  text_layer_set_font(s_eta_layer, fonts_get_system_font(FONT_KEY_GOTHIC_28_BOLD));
  text_layer_set_text_alignment(s_eta_layer, GTextAlignmentCenter);
  layer_add_child(window_layer, text_layer_get_layer(s_eta_layer));

  s_route_layer = text_layer_create(GRect(0, 50, bounds.size.w, 32));
  text_layer_set_text_color(s_route_layer, GColorBlack);
  text_layer_set_background_color(s_route_layer, GColorClear);
  text_layer_set_font(s_route_layer, fonts_get_system_font(FONT_KEY_GOTHIC_28_BOLD));
  text_layer_set_text_alignment(s_route_layer, GTextAlignmentCenter);
  layer_add_child(window_layer, text_layer_get_layer(s_route_layer));
  
  s_time_layer = text_layer_create(GRect(0, 10, bounds.size.w, 32));
  text_layer_set_text_color(s_time_layer, GColorBlack);
  text_layer_set_background_color(s_time_layer, GColorClear);
  text_layer_set_font(s_time_layer, fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD));
  text_layer_set_text_alignment(s_time_layer, GTextAlignmentCenter);
  layer_add_child(window_layer, text_layer_get_layer(s_time_layer));
  
  update_time();
  Tuplet initial_values[] = {
    TupletInteger(TRANSIT_ICON_KEY, (uint8_t) 1),
    
    TupletCString(TRANSIT_STOP_KEY, "Retry After 30s"),
    TupletCString(TRANSIT_ETA_KEY, "-1"),
    TupletCString(TRANSIT_ROUTE_KEY, "Loading Data")
    
  };
  
//APP_LOG(APP_LOG_LEVEL_DEBUG,"Hi2");
  app_sync_init(&s_sync, s_sync_buffer, sizeof(s_sync_buffer),
      initial_values, ARRAY_LENGTH(initial_values),
      sync_tuple_changed_callback, sync_error_callback, NULL);

  request_TRANSIT();
  //APP_LOG(APP_LOG_LEVEL_DEBUG,"Hi3");
}

static void window_unload(Window *window) {
  if (s_icon_bitmap) {
    gbitmap_destroy(s_icon_bitmap);
  }
text_layer_destroy(s_time_layer);
  text_layer_destroy(s_route_layer);
  text_layer_destroy(s_eta_layer);
  text_layer_destroy(s_stop_layer);
  bitmap_layer_destroy(s_icon_layer);
}

static void init(void) {
  s_main_window = window_create();
  tick_timer_service_subscribe(MINUTE_UNIT, tick_handler);
  window_set_background_color(s_main_window, PBL_IF_COLOR_ELSE(GColorCeleste , GColorBlack));
  window_set_window_handlers(s_main_window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload
  });
  window_stack_push(s_main_window, true);

  app_message_open(128, 128);
}

static void deinit(void) {
  window_destroy(s_main_window);

  app_sync_deinit(&s_sync);
}

int main(void) {
  init();
  app_event_loop();
  deinit();
}
