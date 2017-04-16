#include "pebble.h"
#include <time.h>
#include <inttypes.h>

static Window *s_main_window;

static TextLayer *s_stop_layer;
static TextLayer *s_eta_layer;
static TextLayer *s_route_layer;
static TextLayer *s_time_layer;
static BitmapLayer *s_icon_layer;
static Layer *s_ui_layer;

static GBitmap *s_icon_bitmap = NULL;

static AppSync s_sync;
static uint8_t s_sync_buffer[1024];
static char test2[50];
static char test[50];
static char test3[50];
static char test4[50];


static int userdir;
static char dft[50];
static char Nrte[50];
static char Srte[50];
static char Wrte[50];
static char Erte[50];
static char Wstop[50];
static char Sstop[50];
static char Estop[50];
static char Nstop[50];
static char Weta[50];
static char Seta[50];
static char Neta[50];
static char Eeta[50];

static int eta=0;
static int dftdir=0;
//static struct tm s_last_time;
static struct tm s_time;
char *asctime(const struct tm *clock);
  //time_t ttt = time(NULL);
    //struct tm *time_now = localtime(&ttt);
static char label[12];

enum TRANSITKey {
  TRANSIT_ICON_KEY = 0x0,         // TUPLE_INT
  E_STOP_KEY = 0x1,  // TUPLE_CSTRING
  E_ETA_KEY = 0x2,         // TUPLE_CSTRING
  E_ROUTE_KEY = 0x3,        // TUPLE_CSTRING
  W_STOP_KEY = 0x4,  // TUPLE_CSTRING
  W_ETA_KEY = 0x5,         // TUPLE_CSTRING
  W_ROUTE_KEY = 0x6,        // TUPLE_CSTRING
  S_STOP_KEY = 0x7,  // TUPLE_CSTRING
  S_ETA_KEY = 0x8,         // TUPLE_CSTRING
  S_ROUTE_KEY = 0x9,        // TUPLE_CSTRING
  N_STOP_KEY = 0x10,  // TUPLE_CSTRING
  N_ETA_KEY = 0x11,         // TUPLE_CSTRING
  N_ROUTE_KEY = 0x12,        // TUPLE_CSTRING
  DIR_KEY = 0x13,        // TUPLE_CSTRING
  MESSAGE_KEY_RequestData = 0x14
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
    case DIR_KEY:
     APP_LOG(APP_LOG_LEVEL_DEBUG,"whasdfadsfaSDF");
    snprintf(dft, sizeof(dft),new_tuple->value->cstring);
    //dftdir=atoi(test2);
    
    APP_LOG(APP_LOG_LEVEL_DEBUG,dft);
    break;
    
    /*
    case TRANSIT_ICON_KEY:
    APP_LOG(APP_LOG_LEVEL_DEBUG,"Hi10");
      if (s_icon_bitmap) {
        gbitmap_destroy(s_icon_bitmap);
      }
      s_icon_bitmap = gbitmap_create_with_resource(TRANSIT_ICONS[new_tuple->value->uint8]);
      break;
    */
    case S_STOP_KEY:
      APP_LOG(APP_LOG_LEVEL_DEBUG,"Hi9");
      snprintf(Sstop, sizeof(Sstop),new_tuple->value->cstring);   
      text_layer_set_text(s_stop_layer,Sstop);
      break;

    case S_ETA_KEY:
      APP_LOG(APP_LOG_LEVEL_DEBUG,"H11");
      snprintf(Seta, sizeof(Seta),new_tuple->value->cstring);
      eta=atoi(Seta);
      snprintf(Seta, sizeof(Seta),"ETA: %d MINS",eta);
      if(eta>-1)
      {
        text_layer_set_text(s_eta_layer,Seta);
      }
    break;
    
    case S_ROUTE_KEY:
      snprintf(Srte, sizeof(Srte),new_tuple->value->cstring);
      APP_LOG(APP_LOG_LEVEL_DEBUG,Srte);
      text_layer_set_text(s_route_layer,Srte);       
    break;
    /*
        case N_STOP_KEY:
      APP_LOG(APP_LOG_LEVEL_DEBUG,"Nstop");
      snprintf(test, sizeof(Nstop),new_tuple->value->cstring);   
      text_layer_set_text(s_stop_layer,Nstop);
    APP_LOG(APP_LOG_LEVEL_DEBUG,Nstop);
      break;

    case N_ETA_KEY:

      snprintf(Neta, sizeof(Neta),new_tuple->value->cstring);
      eta=atoi(Neta);
      snprintf(Neta, sizeof(Neta),"ETA: %d MINS",eta);
      if(eta>-1)
      {
        text_layer_set_text(s_eta_layer,Neta);
      }
    APP_LOG(APP_LOG_LEVEL_DEBUG,"NETA");
    APP_LOG(APP_LOG_LEVEL_DEBUG,Neta);
    break;
    
    case N_ROUTE_KEY:
      snprintf(Nrte, sizeof(Nrte),new_tuple->value->cstring);
    APP_LOG(APP_LOG_LEVEL_DEBUG,"NRTE");
      APP_LOG(APP_LOG_LEVEL_DEBUG,Nrte);
      text_layer_set_text(s_route_layer,Nrte);       
    break;
    
    case W_STOP_KEY:
      APP_LOG(APP_LOG_LEVEL_DEBUG,"Hi9");
      snprintf(Wstop, sizeof(Wstop),new_tuple->value->cstring);   
      text_layer_set_text(s_stop_layer,Wstop);
    break;

    case W_ETA_KEY:
      APP_LOG(APP_LOG_LEVEL_DEBUG,"H11");
      snprintf(Weta, sizeof(Weta),new_tuple->value->cstring);
      eta=atoi(Weta);
      snprintf(Weta, sizeof(Weta),"ETA: %d MINS",eta);
      if(eta>-1)
      {
        text_layer_set_text(s_eta_layer,Weta);
      }
    break;
    
    case W_ROUTE_KEY:
      snprintf(Wrte, sizeof(test3),new_tuple->value->cstring);
      APP_LOG(APP_LOG_LEVEL_DEBUG,Wrte);
      text_layer_set_text(s_route_layer,Wrte);       
    break;
    
    case E_STOP_KEY:
      APP_LOG(APP_LOG_LEVEL_DEBUG,"testetset");
      snprintf(Estop, sizeof(Estop),new_tuple->value->cstring);   
      text_layer_set_text(s_stop_layer,Estop);
    break;

    case E_ETA_KEY:
      APP_LOG(APP_LOG_LEVEL_DEBUG,"noooooooooo");
      snprintf(Eeta, sizeof(Eeta),new_tuple->value->cstring);
      eta=atoi(Eeta);
      snprintf(Eeta, sizeof(Eeta),"ETA: %d MINS",eta);
      if(eta>-1)
      {
        text_layer_set_text(s_eta_layer,Eeta);
      }
    break;
    
    case E_ROUTE_KEY:
      snprintf(Erte, sizeof(Erte),new_tuple->value->cstring);
      APP_LOG(APP_LOG_LEVEL_DEBUG,Erte);
      text_layer_set_text(s_route_layer,Erte);       
    break;
    */
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

void change_direction(void){
    // Declare the dictionary's iterator
DictionaryIterator *out_iter;

// Prepare the outbox buffer for this message
AppMessageResult result = app_message_outbox_begin(&out_iter);
if(result == APP_MSG_OK) {
  // Add an item to ask for weather data
  //int value = 7;
  dict_write_int(out_iter, MESSAGE_KEY_RequestData, &userdir,sizeof(userdir),true);

  // Send this message
  result = app_message_outbox_send();
  if(result != APP_MSG_OK) {
    APP_LOG(APP_LOG_LEVEL_ERROR, "Error sending the outbox: %d", (int)result);
  }
} else {
  // The outbox cannot be used right now
  APP_LOG(APP_LOG_LEVEL_ERROR, "Error preparing the outbox: %d", (int)result);
}
  
}

void down_single_click_handler(ClickRecognizerRef recognizer, void *context) {
   APP_LOG(APP_LOG_LEVEL_DEBUG,"Mach7");
  Window *window = (Window *)context;
  /*S=1
  N=2
  W=3
  E=4
  */
  userdir=1;
  change_direction();
  }

void up_single_click_handler(ClickRecognizerRef recognizer, void *context) {
   APP_LOG(APP_LOG_LEVEL_DEBUG,"Mach8");
  Window *window = (Window *)context;
  /*S=1
  N=2
  W=3
  E=4
  */
  userdir=2;
  change_direction();
}

void click_config_provider(void *context) {
  window_single_click_subscribe(BUTTON_ID_DOWN, down_single_click_handler);
  window_single_click_subscribe(BUTTON_ID_UP, up_single_click_handler);
}



//static ActionBarLayer *s_action_bar_layer;
//static GBitmap *s_tick_bitmap, *s_cross_bitmap;

static void window_load(Window *window) {
     APP_LOG(APP_LOG_LEVEL_DEBUG,"Hi1");
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);

  s_icon_layer = bitmap_layer_create(GRect(0, 10, bounds.size.w, 80));
  layer_add_child(window_layer, bitmap_layer_get_layer(s_icon_layer));
  window_set_click_config_provider(window, click_config_provider);
  //s_tick_bitmap = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_SUN);
  //s_cross_bitmap = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_CLOUD);

  //s_action_bar_layer = action_bar_layer_create();
  //action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_UP, s_tick_bitmap);
  //action_bar_layer_set_icon(s_action_bar_layer, BUTTON_ID_DOWN, s_cross_bitmap);
  //action_bar_layer_add_to_window(s_action_bar_layer, window);
  //action_bar_layer_set_click_config_provider(s_action_bar_layer,click_config_provider);

  
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
    TupletCString(DIR_KEY, ""),
    TupletCString(S_STOP_KEY, "Retry After 30s"),
    TupletCString(S_ETA_KEY, "-1"),
    TupletCString(S_ROUTE_KEY, "Loading Data"),
    TupletCString(W_STOP_KEY, "Retry After 30s"),
    TupletCString(W_ETA_KEY, "-1"),
    TupletCString(W_ROUTE_KEY, "Loading Data"),
    TupletCString(E_STOP_KEY, "Retry After 30s"),
    TupletCString(E_ETA_KEY, "-1"),
    TupletCString(E_ROUTE_KEY, "Loading Data"),
    TupletCString(N_STOP_KEY, "Retry After 30s"),
    TupletCString(N_ETA_KEY, "-1"),
    TupletCString(N_ROUTE_KEY, "Loading Data")
    
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
  //action_bar_layer_destroy(s_action_bar_layer);
  
    //gbitmap_destroy(s_tick_bitmap);
  //gbitmap_destroy(s_cross_bitmap);
  
    window_destroy(window);
  s_main_window = NULL;
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
//window_set_click_config_provider(s_main_window, (ClickConfigProvider) window_single_click_subscribe(BUTTON_ID_UP,));
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
