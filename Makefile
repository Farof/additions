LICENSE=License.md
DIST=dist

LIB=src/lib/uuid.js
SRC=src/enhancer.js \
    src/Range.js \
    src/Color.js \
    src/Element.js \
    src/interfaces/Events.js \
    src/interfaces/Collection.js \
    src/interfaces/Map.js
OUT=${DIST}/additions.js


all: additions
	@echo "make: OK"

additions: ${OUT}
	@echo "additions.js: OK"

${OUT}: ${SRC} ${LIB}
	@echo "/*" > $@
	@cat ${LICENSE} >> $@
	@echo "*/\n\n" >> $@
	@echo "/* START EXTERNAL LIB */" >> $@
	@for FILE in ${LIB}; do \
		cat $${FILE} >> $@; \
		echo "\n" >> $@; \
	done
	@echo "/* END EXTERNAL LIB */\n\n" >> $@
	@for FILE in ${SRC}; do \
		cat $${FILE} >> $@; \
		echo "\n" >> $@; \
	done

clean:
	@rm -f ${OUT} ${OUTMIN}

.PHONY: clean
